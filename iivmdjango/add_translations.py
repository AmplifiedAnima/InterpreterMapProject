import json
import os
import django
from django.db import transaction

# Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iivmdjango.settings')
django.setup()

from api.models import VocabularyItem, Translation

def add_translations():
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
            try:
                # Get existing VocabularyItem
                vocab_item = VocabularyItem.objects.get(id=item['id'])

                # Add translations
                for lang, trans in item['translations'].items():
                    Translation.objects.get_or_create(
                        vocabulary_item=vocab_item,
                        language=lang,
                        defaults={
                            'translation': trans,
                            'is_primary': True
                        }
                    )

                # Handle acronyms if present
                if 'acronymExtendedName' in item:
                    Translation.objects.get_or_create(
                        vocabulary_item=vocab_item,
                        language='en',
                        defaults={
                            'translation': item['acronymExtendedName'],
                            'is_primary': False
                        }
                    )

                print(f"Added translations for: {vocab_item.term}")

            except VocabularyItem.DoesNotExist:
                print(f"VocabularyItem with id {item['id']} not found. Skipping.")
            except Exception as e:
                print(f"Error processing item {item['id']}: {str(e)}")

    print('Successfully added translations')

def run():
    add_translations()

if __name__ == "__main__":
    run()