export async function checkCelebrityWiki(name) {
    const searchName = name.replace(/\s+/g, "_");
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchName)}&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.query && data.query.search && data.query.search.length > 0) {
        const firstResult = data.query.search[0].title;

        if (firstResult.toLowerCase() === searchName.toLowerCase()) {
            const link = `https://en.wikipedia.org/wiki/${encodeURIComponent(firstResult.replace(/ /g, "_"))}`;
            return link;
        }
    }

    return false;
}