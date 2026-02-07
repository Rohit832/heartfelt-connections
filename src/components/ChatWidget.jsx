import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabase';
import './ChatWidget.css';

const ChatWidget = ({ session }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am Ranchi Lab AI Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle Booking Action from AI
    const handleBookingAction = async (bookingData) => {
        try {
            console.log("AI Requested Booking:", bookingData);

            // Prepare payload
            const payload = {
                patient_name: bookingData.name || (session?.data?.user_metadata?.name) || 'Guest',
                phone: bookingData.phone || (session?.identifier) || 'N/A',
                address: bookingData.address || 'Ranchi (Home Collection)',
                test_name: bookingData.test_name,
                booking_date: new Date().toISOString(), // Default to now for simplicity in chat
                price: 0 // Placeholder/TBD
            };

            if (session?.id) {
                payload.user_id = session.id;
            }

            const { data, error } = await supabase
                .from('bookings')
                .insert([payload]);

            if (error) throw error;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `✅ Booking Confirmed! \nTest: ${payload.test_name}\nPatient: ${payload.patient_name}\nReference ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            }]);

        } catch (error) {
            console.error('Booking Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ I tried to book that for you, but encountered a database error. Please try booking via the main buttons." }]);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Context Construction
            let userContext = "User is NOT logged in.";
            if (session) {
                userContext = `User IS logged in. Name: ${session.data?.user_metadata?.full_name || 'Valued User'}. Phone/Email: ${session.identifier}. User ID: ${session.id}.`;
            }

            const systemPrompt = `You are a helpful AI assistant for Ranchi Lab.
            
            Context: ${userContext}
            
            Your Goal: Help users book pathology tests.
            
            Rules:
            1. If the user wants to book a test, ASK for: Test Name, Patient Name, and Phone Number (if not in Context).
            2. If you have the Context (Logged In), CONFIRM with the user: "Shall I book [Test] for [Name] ([Phone])?"
            3. Once the user says "YES" or confirms, you MUST output a JSON block strictly in this format at the end of your message:
            
            ___BOOKING_START___
            {
              "test_name": "exact test name",
              "name": "patient name",
              "phone": "phone number",
              "address": "address if given"
            }
            ___BOOKING_END___
            
            4. Do NOT output the JSON block until you have confirmed details.
            5. Be polite and concise.`;

            // Using Vite proxy
            const response = await fetch('/api/nvidia/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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'
                },
                body: JSON.stringify({
                    model: "meta/llama-3.1-70b-instruct",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages,
                        userMessage
                    ],
                    temperature: 0.2, // Lower temp for more deterministic JSON
                    max_tokens: 1024,
                    stream: false
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                let content = data.choices[0].message.content;

                // Check for JSON block
                const bookingMatch = content.match(/___BOOKING_START___([\s\S]*?)___BOOKING_END___/);

                if (bookingMatch && bookingMatch[1]) {
                    try {
                        const bookingJSON = JSON.parse(bookingMatch[1]);
                        // Remove the JSON block from the displayed message
                        content = content.replace(bookingMatch[0], "").trim();
                        // Trigger Booking
                        handleBookingAction(bookingJSON);
                    } catch (e) {
                        console.error("JSON Parse Error", e);
                    }
                }

                setMessages(prev => [...prev, { role: 'assistant', content: content }]);
            } else {
                throw new Error('Invalid response from API');
            }

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-widget">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Ranchi Lab AI Assistant</h3>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                            ➤
                        </button>
                    </form>
                </div>
            )}

            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '💬' : '🤖'}
            </button>
        </div>
    );
};

export default ChatWidget;
