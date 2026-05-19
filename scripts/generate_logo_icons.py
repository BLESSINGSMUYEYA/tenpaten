import os
from PIL import Image

def generate_icons():
    logo_path = r"C:\Users\mwenitete\.gemini\antigravity\brain\8e4570e9-34a1-4b48-bade-c5fb883d6e99\media__1779227130434.png"
    if not os.path.exists(logo_path):
        print(f"Error: Logo file not found at {logo_path}")
        return

    # Load logo
    logo = Image.open(logo_path)
    
    # Get bounding box of non-transparent content
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
        print("Cropped logo to bounding box:", bbox)

    logo_w, logo_h = logo.size

    # Sizes to generate
    sizes = [192, 512]
    
    for size in sizes:
        # Create a new white square image
        # Using white (#FFFFFF) background to make the navy text 'tenpaten' readable
        icon = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        
        # Calculate maximum scale size with some padding (e.g. 15% padding on each side)
        max_content_size = int(size * 0.70)
        
        # Determine scaling factor
        scale_w = max_content_size / logo_w
        scale_h = max_content_size / logo_h
        scale = min(scale_w, scale_h)
        
        new_w = int(logo_w * scale)
        new_h = int(logo_h * scale)
        
        # Resize logo with high quality
        resized_logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Calculate offset to center the logo
        offset_x = (size - new_w) // 2
        offset_y = (size - new_h) // 2
        
        # Paste logo on white background
        icon.paste(resized_logo, (offset_x, offset_y), resized_logo)
        
        # Convert to RGB before saving (good for PWA/icons compatibility, or keep RGBA if transparency support needed)
        # We will keep RGBA but with solid white background so it behaves correctly
        out_path = f"public/icon-{size}.png"
        icon.save(out_path, "PNG")
        print(f"Generated {out_path} ({size}x{size}) with centered logo")

if __name__ == "__main__":
    generate_icons()
