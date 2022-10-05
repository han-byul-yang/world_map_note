import { ISearchResultInfo } from 'types/searchPlacesType'

export const getSearchPlacesApi = (searchQuery: string, map: boolean) => {
  return new Promise((resolve, reject) => {
    if (!map) return

    const searchPlaces = new kakao.maps.services.Places()
    searchPlaces.keywordSearch(searchQuery, (data, status) => searchProcess(data, status))

    const searchProcess = (data: ISearchResultInfo[], status: kakao.maps.services.Status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve(data)
      }
      if (status === kakao.maps.services.Status.ERROR) {
        reject(new Error('에러 발생 했습니다.'))
      }
      if (status === kakao.maps.services.Status.ZERO_RESULT) {
        resolve(null)
      }
    }
  })
}