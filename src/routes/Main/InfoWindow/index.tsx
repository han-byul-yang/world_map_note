import { Dispatch, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import useClickOutside from 'hooks/useClickOutside'
import { clickedMarkPositionAtom, isOpenMessageModalAtom, messageAtom } from 'store/atom'
import modalMessage from 'utils/modalMessage'
import { getAddressByPositionApi } from 'services/api/searchKakaoApi'
import { ISearchAddressResultInfo } from 'types/searchPlacesType'
import PlaceInfoBox from './PlaceInfoBox'

import { NotebookIcon, WriteIcon } from 'assets/svgs'
import styles from './infoWindow.module.scss'

interface IInfoWindowProps {
  setOpenInfoWindow: Dispatch<React.SetStateAction<boolean>>
  setOpenAddNoteForm: Dispatch<React.SetStateAction<boolean>>
  isMapLoaded: boolean
}

const InfoWindow = ({ setOpenInfoWindow, setOpenAddNoteForm, isMapLoaded }: IInfoWindowProps) => {
  const containerRef = useRef(null)
  const clickedMarkPosition = useRecoilValue(clickedMarkPositionAtom)
  const setMessage = useSetRecoilState(messageAtom)
  const setOpenMessageModal = useSetRecoilState(isOpenMessageModalAtom)

  const clickOutsideTarget = () => {
    setOpenInfoWindow(false)
  }
  const { clickOutsideEvent } = useClickOutside(containerRef, clickOutsideTarget)

  const { isLoading } = useQuery(
    ['getAddressByPosition', clickedMarkPosition.latitude, clickedMarkPosition.longitude],
    () => getAddressByPositionApi(clickedMarkPosition, isMapLoaded),
    {
      onSuccess: (res: ISearchAddressResultInfo[]) => {},
      staleTime: 1000,
      cacheTime: 1000,
      onError: () => {
        setOpenMessageModal(true)
        setMessage(modalMessage().error.api.SOMETHING_WRONG)
      },
    }
  )

  useEffect(() => {
    clickOutsideEvent()
  }, [clickOutsideEvent])

  const handleAddNoteClick = () => {
    setOpenAddNoteForm(true)
  }

  const handleReadNoteClick = () => {}

  return (
    <>
      <div className={styles.background} />
      <div className={styles.infoWindowContainer} ref={containerRef}>
        <PlaceInfoBox isLoading={isLoading} />
        <button className={styles.memoButton} type='button' onClick={handleAddNoteClick}>
          <WriteIcon className={styles.icon} />
          추억 추가
        </button>
        <button className={styles.memoButton} type='button' onClick={handleReadNoteClick}>
          <NotebookIcon className={styles.icon} />
          추억 보기
        </button>
      </div>
    </>
  )
}

export default InfoWindow
