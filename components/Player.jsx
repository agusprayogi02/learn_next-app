import {
  FastForwardIcon,
  HeartIcon,
  RefreshIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from '@heroicons/react/outline';
import {PauseIcon, PlayIcon, VolumeUpIcon as VolumeDownIcon} from '@heroicons/react/solid';
import {debounce} from 'lodash';
import {useSession} from 'next-auth/react';
import {useCallback, useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {currentTrackIdState, isPlayingState} from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';
import {millisToMinutesAndSeconds} from '../lib/time';

function Player() {
  const spotifyApi = useSpotify();
  const {data: session, status} = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlayingSong, setIsPlayingSong] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [song, setSong] = useState(null);
  const [duration, setDuration] = useState(0);
  const songInfo = useSongInfo();

  const fetchCurrentSong = async () => {
    if (!songInfo) {
      await spotifyApi.getMyCurrentPlaybackState().then(async ({body}) => {
        setIsPlayingSong(body.is_playing);
        console.log('playing now ', body);
        setCurrentTrackId(body?.item?.id);
        console.log(body);
        var dur = (body?.progress_ms / body?.item?.duration_ms) * 100;
        setDuration(Math.floor(dur));
        setSong(body);
      });
    }
  };

  const handlePlayPause = async () => {
    await spotifyApi.getMyCurrentPlaybackState().then(({body}) => {
      if (body.is_playing) {
        spotifyApi.pause();
      } else {
        spotifyApi.play();
      }
      setIsPlayingSong(!body.is_playing);
    });
  };

  useEffect(async () => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // ambil yang baru saja di putar
      await fetchCurrentSong();
      setVolume(50);
    }
  }, [session, isPlayingSong, currentTrackId]);

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedVolume(volume);
    }
  }, [volume]);

  const debouncedVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume);
    }, 100),
    [volume],
  );

  return (
    <div className="h-24 w-screen bg-gradient-to-b to-black from-gray-900 border-t border-gray-800 px-2 md:px-8 grid grid-cols-3 text-xs md:text-base text-white">
      {/* Left */}
      <div className="flex items-center space-x-4 text-gray-500">
        <img className="hidden md:inline w-10 h-10" src={songInfo?.album?.images?.[2].url} alt="" />
        <div className="flex items-center space-x-6 w-36 lg:w-64 truncate">
          <div>
            <p className=" text-white">{songInfo?.name}</p>
            <div className="flex text-sm">
              {songInfo?.artists?.map((artist, i) => (
                <p key={artist.id}>
                  {artist.name}
                  {i !== songInfo?.artists.length - 1 && ', '}{' '}
                </p>
              ))}
            </div>
          </div>
          <HeartIcon className="button hover:text-white" />
        </div>
      </div>
      {/* Center */}
      <div className="p-3 ">
        {/* Bagian Atas */}
        <div className="flex items-center justify-evenly">
          <SwitchHorizontalIcon className="button" />
          <RewindIcon className="button" />
          {isPlayingSong ? (
            <PauseIcon onClick={handlePlayPause} className="button h-8 w-8" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button h-8 w-8" />
          )}
          <FastForwardIcon className="button" />
          <RefreshIcon className="button" />
        </div>
        {/* Bagian bawah */}
        <div className="flex items-center space-x-3">
          <p>{millisToMinutesAndSeconds(song?.progress_ms)}</p>
          <input className="flex-1" type="range" min="0" max="100" value={duration} readOnly />
          <p>{duration}%</p>
        </div>
      </div>
      {/* Right */}
      <div className="flex items-start mt-4 justify-end">
        <div className="flex items-center space-x-3">
          <VolumeDownIcon
            className="button"
            onClick={() => (volume > 0 ? setVolume((volume -= 5)) : null)}
          />
          <input
            className="w-12 md:w-28"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <VolumeUpIcon
            className="button decoration-pink-500"
            onClick={() => (volume < 100 ? setVolume((volume += 5)) : null)}
          />
          <p>{volume}%</p>
        </div>
      </div>
    </div>
  );
}

export default Player;
