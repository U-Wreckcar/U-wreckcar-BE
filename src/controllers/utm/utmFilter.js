async function utmFilters(req) {
    const query = req;

    let sql_query = 'SELECT * FROM kshexportdb.utmtest_2';

    // const data = {
    //     생성날짜: '2023.02.22',
    //     url: 'https://www.naver.com/',
    //     캠페인ID: 'naver테스트',
    //     소스: null,
    //     미디움: 'paidsearching',
    //     캠페인이름: '2022_유렉카 기획',
    //     캠페인텀: 'iphone12',
    //     캠페인콘텐츠: 'image1',
    //     shortenUrl: 'www.naver.com',
    //     utm: null,
    // };

    // const createdat = data['생성날짜'];
    // const url = data['url'];
    // const campaignId = data['캠페인ID'];
    // const source = data['소스'];
    // const campaignTerm = data['캠페인텀'];
    // const content = data['캠페인콘텐츠'];
    // const shortenUrl = data['shortenUrl'];
    // const utm = data['utm'];

    let andStack = 1;

    if (!query) {
        sql_query;
    } else {
        sql_query = sql_query + ' where ';

        const createdat = query['created_at'];
        const url = query['utm_url'];
        const campaignId = query['utm_campaign_id'];
        const source = query['utm_source'];
        const medium = query['utm_medium'];
        const campaigName = query['utm_campaign_name'];
        const campaignTerm = query['utm_term'];
        const content = query['utm_content'];
        const fullUrl = query['full_url'];
        const shortenUrl = query['shorten_url'];

        if (createdat != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + 'and';
            sql_query = sql_query + `createdat like '%${query['created_at']}%'`;
        }
        if (url != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `url like '%${query['utm_url']}%'`;
        }
        if (campaignId != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `campaignId like '%${query['utm_campaign_id']}%'`;
        }
        if (source != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `source like '%${query['utm_source']}%'`;
        }
        if (medium != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `source like '%${query['utm_medium']}%'`;
        }
        if (campaigName != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `source like '%${query['utm_campaign_name']}%'`;
        }
        if (campaignTerm != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `term like '%${query['utm_term']}%'`;
        }
        if (content != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `content like '%${query['utm_content']}%'`;
        }
        if (shortenUrl != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `shortenUrl like '%${query['shorten_url']}%'`;
        }
        if (fullUrl != null) {
            andStack--;
            if (andStack < 0) sql_query = sql_query + ' and ';
            sql_query = sql_query + `shortenUrl like '%${query['full_url']}%'`;
        }

        sql_query = sql_query + ';';
        andStack = 1;
    }
    console.log(sql_query);

    return sql_query;
    // return res.status(200).json({
    //     isSuccess: true,
    //     msg: '필터링에 따른 쿼리가 완성되었습니다',
    //     sql_query,
    // });
}

export { utmFilters };
