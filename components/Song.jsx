import {useRecoilState} from 'recoil';
import {currentTrackIdState, isPlayingState} from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import {millisToMinutesAndSeconds} from '../lib/time';

function Song({
  order,
  track: {
    track: {id, name, artists, album, duration_ms, uri},
  },
}) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlayingSong, setIsPlayingSong] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(id);
    spotifyApi
      .play({
        uris: [uri],
      })
      .then(() => {
        setIsPlayingSong(true);
      });
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 hover:bg-gray-900 rounded-lg py-3 px-4 cursor-pointer text-sm"
      onClick={playSong}>
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10" src={album.images?.[2]?.url} alt="" />
        <div>
          <p className="w-36 lg:w-64 truncate text-white text-base font-semibold">{name}</p>
          <p className="w-40">{artists[0].name}</p>
        </div>
      </div>
      <div className="flex items.center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{album.name}</p>
        <p>{millisToMinutesAndSeconds(duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
