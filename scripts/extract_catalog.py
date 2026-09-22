import fitz  # PyMuPDF
import os
import sys

def extract_from_pdf(pdf_path, output_img_dir, output_text_path):
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        sys.exit(1)

    os.makedirs(output_img_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    text_content = []

    print(f"Processing {pdf_path} (Pages: {len(doc)})")

    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # 1. Извлекаем текст
        text = page.get_text()
        if text.strip():
            text_content.append(f"--- Страница {page_num + 1} ---\n{text}")

        # 2. Извлекаем картинки
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Игнорируем слишком маленькие картинки (иконки, линии и т.д.)
            if len(image_bytes) < 5000:
                continue

            image_filename = f"page_{page_num + 1}_img_{img_index + 1}.{image_ext}"
            image_filepath = os.path.join(output_img_dir, image_filename)
            
            with open(image_filepath, "wb") as f:
                f.write(image_bytes)
                
            print(f"Сохранено изображение: {image_filename}")

    # Сохраняем весь извлеченный текст в файл
    with open(output_text_path, "w", encoding="utf-8") as f:
        f.write("\n\n".join(text_content))
    
    print(f"\nТекст сохранен в {output_text_path}")
    print(f"Изображения сохранены в {output_img_dir}")

if __name__ == "__main__":
    pdf_file = r"D:\Neuro\clients\moroshka\start\Каталог МорошкаЛес_compressed.pdf"
    out_images = r"D:\Neuro\clients\moroshka\site_ml\src\assets\images\catalog"
    out_text = r"D:\Neuro\clients\moroshka\site_ml\src\data_files\catalog_raw_text.txt"
    
    extract_from_pdf(pdf_file, out_images, out_text)
