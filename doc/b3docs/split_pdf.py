"""
Script to split 'Б3. Руководство оператора.pdf' into 4 equal parts.
Usage: python split_pdf.py
"""

import os
from pathlib import Path

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    print("Installing pypdf...")
    os.system("pip install pypdf")
    from pypdf import PdfReader, PdfWriter


def split_pdf(input_path: str, num_parts: int = 4) -> list[str]:
    """Split a PDF into specified number of parts."""

    input_path = Path(input_path)
    if not input_path.exists():
        raise FileNotFoundError(f"PDF not found: {input_path}")

    print(f"Reading: {input_path.name}")
    reader = PdfReader(str(input_path))
    total_pages = len(reader.pages)
    print(f"Total pages: {total_pages}")

    # Calculate pages per part
    pages_per_part = total_pages // num_parts
    remainder = total_pages % num_parts

    output_dir = input_path.parent
    base_name = input_path.stem
    output_files = []

    current_page = 0
    for part_num in range(1, num_parts + 1):
        writer = PdfWriter()

        # Distribute remainder pages to first parts
        part_pages = pages_per_part + (1 if part_num <= remainder else 0)
        end_page = current_page + part_pages

        print(f"\nPart {part_num}: pages {current_page + 1}-{end_page}")

        for page_idx in range(current_page, end_page):
            writer.add_page(reader.pages[page_idx])

        output_name = f"{base_name}_part{part_num}.pdf"
        output_path = output_dir / output_name

        with open(output_path, "wb") as output_file:
            writer.write(output_file)

        print(f"  Saved: {output_name} ({part_pages} pages)")
        output_files.append(str(output_path))
        current_page = end_page

    return output_files


if __name__ == "__main__":
    # Path to the PDF file
    pdf_path = Path(__file__).parent / "Б3. Руководство оператора.pdf"

    try:
        result = split_pdf(pdf_path)
        print(f"\n✓ Successfully split into {len(result)} files:")
        for f in result:
            print(f"  - {Path(f).name}")
    except Exception as e:
        print(f"Error: {e}")
