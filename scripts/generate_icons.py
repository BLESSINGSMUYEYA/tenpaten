import os
from PIL import Image

def generate_icons():
    source_path = r"c:\Users\mwenitete\Desktop\Blessings\Tenpaten project\tenpaten-web\src\app\icon.png"
    public_dir = r"c:\Users\mwenitete\Desktop\Blessings\Tenpaten project\tenpaten-web\public"
    
    if not os.path.exists(source_path):
        # Fallback to public/favicon.png
        source_path = os.path.join(public_dir, "favicon.png")
        print(f"Primary icon not found, using fallback: {source_path}")
        
    if not os.path.exists(source_path):
        print("Error: No source image found for icon generation.")
        return

    print(f"Opening source image: {source_path}")
    img = Image.open(source_path)
    
    # Save 192x192
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    path_192 = os.path.join(public_dir, "icon-192.png")
    img_192.save(path_192, "PNG")
    print(f"Generated 192x192 icon at: {path_192}")
    
    # Save 512x512
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    path_512 = os.path.join(public_dir, "icon-512.png")
    img_512.save(path_512, "PNG")
    print(f"Generated 512x512 icon at: {path_512}")

if __name__ == "__main__":
    generate_icons()
