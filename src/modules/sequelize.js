import db from '../../models/index.js';

// UTM 링크 저장.(테스트)
export async function createUtmData(user_id, utm_source, utm_medium) {
    const sourceResult = await db.User_utm_sources.create({
        user_id: user_id,
        source_name: utm_source,
    });
    const mediumResult = await db.User_utm_mediums.create({
        user_id: user_id,
        medium_name: utm_medium,
    });

    console.log(sourceResult);
    console.log(mediumResult);
}
