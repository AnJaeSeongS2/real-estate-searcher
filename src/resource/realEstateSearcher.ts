const axios = require('axios')
const PAGING_COUNT:number = 20
const delay = (ms:number) => {
    console.log(`delay ${ms}`)
    return new Promise(resolve => setTimeout(resolve, ms))
}
let countCall = 0
const asyncForEach = async (array, callback:Function) => {
    for (let index = 0; index < array.length; index++) {
        array.forEach
        console.log(countCall++)
        await delay(1250)
        await callback(array[index], index, array)
    }
}
class ListURL {
    clusterList:Function
    articleList:Function
    constructor(clusterList:Function, articleList:Function) {
        this.clusterList = clusterList
        this.articleList = articleList
    }
}
class Article {
    no:number
    desc:string
    constructor(no:number, desc:string) {
        this.no = no
        this.desc = desc
    }
}

const getListURL:Array<ListURL> = []
// TRHEE
// getListURL.push(new ListURL(():string => {
//     return `https://m.land.naver.com/cluster/clusterList?view=atcl&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5561777&lon=127.0149165&btm=37.5422106&lft=126.9973856&top=37.5701422&rgt=127.0324474&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=THREEROOM&pCortarNo=`
// }, 
// (itemId:string, lgeo:string, page:number):string => {
//     return `https://m.land.naver.com/cluster/ajax/articleList?itemId=${itemId}&mapKey=&lgeo=${lgeo}&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5561777&lon=127.0149165&btm=37.5430443&lft=126.9973856&top=37.5693088&rgt=127.0324474&cortarNo=&showR0=&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=THREEROOM&page=${page}`
// }))
// getListURL.push(new ListURL(():string => {
//     return `https://m.land.naver.com/cluster/clusterList?view=atcl&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5416151&lon=127.0673161&btm=37.5284791&lft=127.0497852&top=37.5547488&rgt=127.0848471&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=THREEROOM&pCortarNo=15_1121510700`
// }, 
// (itemId:string, lgeo:string, page:number):string => {
//     return `https://m.land.naver.com/cluster/ajax/articleList?itemId=${itemId}&mapKey=&lgeo=${lgeo}&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5407304&lon=127.067917&btm=37.5275942&lft=127.050386&top=37.5538642&rgt=127.0854479&cortarNo=&showR0=&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=THREEROOM&page=${page}`
// }))

//TWOROOM
getListURL.push(new ListURL(():string => {
    return `https://m.land.naver.com/cluster/clusterList?view=atcl&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5416151&lon=127.0673161&btm=37.5284791&lft=127.0497852&top=37.5547488&rgt=127.0848471&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=TWOROOM&pCortarNo=15_1121510700`
}, 
(itemId:string, lgeo:string, page:number):string => {
    return `https://m.land.naver.com/cluster/ajax/articleList?itemId=${itemId}&mapKey=&lgeo=${lgeo}&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5407304&lon=127.067917&btm=37.5275942&lft=127.050386&top=37.5538642&rgt=127.0854479&cortarNo=&showR0=&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=TWOROOM&page=${page}`
}))
getListURL.push(new ListURL(():string => {
    return `https://m.land.naver.com/cluster/clusterList?view=atcl&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5416151&lon=127.0673161&btm=37.5284791&lft=127.0497852&top=37.5547488&rgt=127.0848471&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=TWOROOM&pCortarNo=15_1121510700`
}, 
(itemId:string, lgeo:string, page:number):string => {
    return `https://m.land.naver.com/cluster/ajax/articleList?itemId=${itemId}&mapKey=&lgeo=${lgeo}&rletTpCd=APT%3AOPST%3AVL&tradTpCd=B1&z=15&lat=37.5407304&lon=127.067917&btm=37.5275942&lft=127.050386&top=37.5538642&rgt=127.0854479&cortarNo=&showR0=&wprcMin=20000&wprcMax=40000&spcMin=33&spcMax=132&tag=TWOROOM&page=${page}`
}))

function getArticleInfoURL(articleNo:number):string {
    return `https://m.land.naver.com/article/info/${articleNo}`
}
function getSearchDescStr():string {
    return `임대사업자`
}

function getArticleListURLs(itemId:string, lgeo:string, maxPage:number, articleArray:Array<Article>, getArticleListURL:Function):Array<string> {
    let urls:Array<string> = []
    for (let page:number = 1; page <= maxPage; page++) {
        urls.push(getArticleListURL(itemId, lgeo, page))
    }
    return urls
}

async function getArticlePage(url:string, articleArray:Array<Article>):Promise<any> {
    return axios.get(url).then(res => {
        res.data.body.forEach(body => {
            if (body.atclFetrDesc != null && body.atclFetrDesc.includes(getSearchDescStr())) {
                articleArray.push(new Article(body.atclNo, body.atclFetrDesc))
            }
        })
    })
}

async function getAllArticleListFromClusterList() {
    let articleArray:Array<Article> = []
    let allArticleReq:Array<Promise<any>> = []
    let allArticleListURLs:Array<string> = []
    let articleCount:number = 0
    await asyncForEach(getListURL, async (entry) => {
        await axios.get(entry.clusterList()).then(async res => {
            res.data.data.ARTICLE.forEach(article => {
                console.log(`${article.lgeo}'s count: ${article.count}, article list :\n`)
                if (article.count == 1) {
                    getArticleListURLs(article.itemId, article.lgeo, parseInt((article.count/PAGING_COUNT).toString()) + 1, articleArray, entry.articleList).forEach(url => {
                        allArticleListURLs.push(url)
                    })
                } else {
                    getArticleListURLs(article.lgeo, article.lgeo, parseInt((article.count/PAGING_COUNT).toString()) + 1, articleArray, entry.articleList).forEach(url => {
                        allArticleListURLs.push(url)
                    })
                }
                articleCount += article.count
            })
        })
    })
            
    console.log(`all articleCount: ${articleCount}`)
    await asyncForEach(allArticleListURLs, async url => {
        allArticleReq.push(await getArticlePage(url, articleArray))
    })

    console.log(`\n\nSearched article count : ${articleArray.length}\n\n`)
    articleArray.forEach(article => {
        console.log(`${article.no} : ${article.desc}\n\turl: ${getArticleInfoURL(article.no)}`)
    })
}
function getSearchedArticleList():void {
    getAllArticleListFromClusterList();
}

export default {
    getSearchedArticleList
}