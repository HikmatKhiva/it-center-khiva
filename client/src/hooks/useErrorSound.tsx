import { useSound } from "use-sound";
import { useSoundPreference } from "./useSoundPreference ";
const ERROR_MP3 = "/sound/fahhhhh.mp3"; // public/sound/
export const useErrorSound = () => {
  const { soundEnabled } = useSoundPreference();
  const [playError] = useSound(ERROR_MP3, {
    volume: soundEnabled ? 0.5 : 0,
    playbackRate: 1,
    interrupt: true,
  });
  return playError;
};
