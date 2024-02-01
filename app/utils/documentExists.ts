import queryCollection from './queryCollection';

export default async function documentExists(collectionName: string, query: object): Promise<{ success: boolean; result: any }> {
    var response = await queryCollection(collectionName, query)

    // Change the response to a bool - if the document exists or not
    if (response.success) {
        response.result = response.result.length > 0
    }

    return response
}