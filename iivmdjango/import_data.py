import json
import os
import django

# Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iivmdjango.settings')
django.setup()

from api.models import VocabularyItem, Translation
from django.db import transaction

def import_data():
    # Delete all existing data
    print("Deleting existing data...")
    VocabularyItem.objects.all().delete()
    Translation.objects.all().delete()

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

    # Process each item in the JSON data
    with transaction.atomic():
        for item in data:
            # Create VocabularyItem
            vocab_item = VocabularyItem.objects.create(
                id=item['id'],
                term=item['term'],
                category=item['category'],
                definition=item.get('definition', ''),  # Add this if you have definitions in your data
            )

            # Create Translations
            for lang, trans in item['translations'].items():
                Translation.objects.create(
                    vocabulary_item=vocab_item,
                    language=lang,
                    translation=trans,
                    is_primary=True,  # Assuming all translations in the JSON are primary
                )

            # Handle acronyms if present
            if 'acronymExtendedName' in item:
                Translation.objects.create(
                    vocabulary_item=vocab_item,
                    language='en',  # Assuming acronyms are in English
                    translation=item['acronymExtendedName'],
                    is_primary=False,
                )

    print('Successfully imported data')

def run():
    import_data()