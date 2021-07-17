import { SiteClient } from 'datocms-client'

export default async function createRecord(request, response) {
    if (request.method === 'POST') {
        const TOKEN = '4fc968e574587c80414c932037e161'
        const client = new SiteClient(TOKEN)
    
        const record = await client.items.create({
            itemType: '976004',
            ...request.body,
        })
    
        console.log(record)
    
        response.json({
            dados: 'Algum dado qualquer',
            record: record,
        })

        return
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}