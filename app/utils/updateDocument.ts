import { Collection } from 'mongodb';

type FormData = {
    name?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
};


export default async function updateDocument(collection: Collection, json: FormData): Promise<{ success: boolean; message: string }> {

    const name = json.name;
    delete json.name
    try {
        const result = await collection.updateOne(
            { name: name },
            {
                $set: json,
            }
        );

        if (result.acknowledged) {
            console.log('Document was successfully updated:', result.upsertedId);
            return { success: true, message: 'Document was successfully updated.' };
        } else {
            console.log('No document was updated.');
            return { success: false, message: 'No document was updated.' };
        }
    } catch (error) {
        console.error('An error occurred while updating the document:', error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: 'An unknown error occurred.' };
        }
    }
}