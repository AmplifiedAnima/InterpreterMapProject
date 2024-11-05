import json
import os
import django
import uuid
from django.db import transaction, connections

# Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iivmdjango.settings')
django.setup()

from api.models import VocabularyItem, Translation

def clear_data():
    with transaction.atomic():
        VocabularyItem.objects.all().delete()
        Translation.objects.all().delete()
    connections.close_all()
    print("All existing data cleared.")

def import_data():
    # Clear all existing data
    clear_data()

    # Path to JSON file
    file_path = 'api/mock_data/vocabulary.json'

    # Load data from JSON file
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f'File {file_path} not found')
        return
    except json.JSONDecodeError:
        print('Error decoding JSON')
        return

    # Default medical description (shortened for brevity)
    default_definition = "This medical term represents a crucial concept in the field of healthcare and medical science, encompassing various aspects of human anatomy, physiology, pathology, or medical practice. It plays a vital role in the understanding, diagnosis, treatment, or prevention of diseases and health conditions. Healthcare professionals, including doctors, nurses, and specialists, frequently use this term in clinical settings to communicate effectively about patient care, medical procedures, or research findings. The concept may be applicable across multiple medical specialties, such as cardiology, neurology, oncology, or general medicine, highlighting its broad relevance in the healthcare domain. Understanding this term is essential for medical students, researchers, and practitioners, as it forms a fundamental part of medical knowledge and contributes to the development of evidence-based practices. The term may have historical significance in the evolution of medical science, possibly linked to important discoveries or advancements in healthcare. In contemporary medicine, it might be associated with cutting-edge research, innovative treatments, or emerging healthcare technologies. The implications of this term extend beyond clinical practice, potentially influencing public health policies, patient education initiatives, or healthcare management strategies. As medical science continues to evolve, the significance and application of this term may adapt, reflecting the dynamic nature of healthcare and biomedical research. Staying informed about the latest developments related to this term is crucial for healthcare professionals to provide optimal patient care and contribute to the advancement of medical knowledge."

    # Process each item in the JSON data
    with transaction.atomic():
        for item in data:
            # Generate a new UUID for each item
            new_id = str(uuid.uuid4())[:10]  # Using first 10 characters of UUID

            # Create VocabularyItem with new UUID
            vocab_item = VocabularyItem.objects.create(
                id=new_id,
                term=item['term'],
                definition=item.get('definition', default_definition),
                category=item['category'],
            )

            # Create Translations
            for lang, trans in item['translations'].items():
                Translation.objects.create(
                    vocabulary_item=vocab_item,
                    language=lang,
                    translation=trans,
                    is_primary=True,
                )

            # Handle acronyms if present
            if 'acronymExtendedName' in item:
                Translation.objects.create(
                    vocabulary_item=vocab_item,
                    language='en',
                    translation=item['acronymExtendedName'],
                    is_primary=False,
                )

    print('Successfully imported data with new UUIDs')

def run():
    import_data()

if __name__ == "__main__":
    run()