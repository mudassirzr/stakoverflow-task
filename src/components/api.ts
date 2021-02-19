import axios from "axios";
const API_URL = "https://api.stackexchange.com/2.2/questions";
const API_KEY = "U4DMV*8nvpm3EOpvf69Rxw((";
export function getQuestions(currentPage:number, pageSize:number){
    // return axios
    //     .get(
    //       API_URL +
    //         `?key=${API_KEY}&order=desc&sort=activity&site=stackoverflow&&page=${currentPage}&pagesize=${pageSize}`
    //     )
    //     .then(function (response) {
    //       let newItems: ListValue = {};
    //       response.data.items.forEach((item: ItemValue, key: number) => {
    //         newItems[key + currentPage * pageSize - pageSize] = {
    //           author: item.owner.display_name,
    //           title: item.title,
    //           creation_date: getLocaleStringFromEpoch(item.creation_date),
    //           question_id: item.question_id,
    //         };
    //       });
    //       setList({ ...list, ...newItems });
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
}