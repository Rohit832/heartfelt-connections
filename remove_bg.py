from PIL import Image

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if pixel is white (or very close to white)
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

input_file = "/Users/Rohit/.gemini/antigravity/brain/67c26401-4062-40f4-9714-000a2653fdc0/hero_people_white_bg_1770438376384.png"
output_file = "public/hero_people_transparent_final.png"

remove_white_bg(input_file, output_file)
