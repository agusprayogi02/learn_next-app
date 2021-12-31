import {ChevronDownIcon} from '@heroicons/react/outline';
import {shuffle} from 'lodash';
import {signOut, useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {playlistIdState, playlistState} from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
  'from-red-500',
  'from-pink-500',
  'from-yellow-500',
  'from-green-500',
  'from-blue-500',
  'from-indigo-500',
  'from-purple-500',
];

function Center() {
  const {data: session} = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (playlistId !== '') {
      spotifyApi
        .getPlaylist(playlistId)
        .then(({body}) => {
          setPlaylist(body);
        })
        .catch((err) => console.log('Something went wrong ', err));
    }
  }, [spotifyApi, playlistId]);

  console.log(playlist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-3 right-5" onClick={signOut}>
        <div className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer border-white rounded-full p-1 pr-2">
          <img className="w-10 h-10 rounded-full" src={session?.picture} alt="" />
          <h2>{session?.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-bl to-black ${color} text-white p-8 h-80 w-full`}>
        <img src={playlist?.images?.[0]?.url} className="h-44 w-44 shadow-2xl" alt="" />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
        </div>
      </section>
      <Songs />
    </div>
  );
}

export default Center;
