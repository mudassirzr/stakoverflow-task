import axios from "axios";
import { ApiResponse } from "./types";
import { getLocaleStringFromEpoch } from "./utils";

const API_URL = "https://api.stackexchange.com/2.2/questions";
const API_KEY = "U4DMV*8nvpm3EOpvf69Rxw((";
export function getQuestions(currentPage: number, pageSize: number) {
  return axios
    .get(
      API_URL +
        `?key=${API_KEY}&filter=withbody&order=desc&sort=activity&site=stackoverflow&&page=${currentPage}&pagesize=${pageSize}`
    )
    .then(function (response) {
      let newItems = response.data.items.map(
        (item: ApiResponse, key: number) => ({
          author: item.owner.display_name,
          title: item.title,
          creation_date: getLocaleStringFromEpoch(item.creation_date),
          question_id: item.question_id,
          link: item.link,
          body: item.body,
        })
      );
      return newItems;
    })
    .catch(function (error) {
      console.log(error);
    });
}
