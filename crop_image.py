from PIL import Image

def crop_top(input_path, output_path, percentage=0.15):
    img = Image.open(input_path)
    width, height = img.size
    crop_height = int(height * percentage)
    
    # Correct box tuple: (left, upper, right, lower)
    # We want to keep everything EXCEPT the top portion
    box = (0, crop_height, width, height)
    
    cropped_img = img.crop(box)
    cropped_img.save(output_path, "PNG")
    print(f"Saved cropped image to {output_path} (removed top {percentage*100}%)")

input_file = "public/hero_people_blue_raw.png"
output_file = "public/hero_people_final.png"

crop_top(input_file, output_file)
