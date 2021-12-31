import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {currentTrackIdState} from '../atoms/songAtom';
import useSpotify from './useSpotify';

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const getSongInfo = async () => {
      if (currentTrackId) {
        const track = await spotifyApi.getTrack(currentTrackId);
        setSongInfo(track.body);
      }
    };
    getSongInfo();
  }, [currentTrackId, spotifyApi]);
  return songInfo;
}

export default useSongInfo;
