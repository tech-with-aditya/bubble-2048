import { GameContainer } from './components/GameContainer';
import { BackgroundBubbles } from './components/BackgroundBubbles';
import { WaterEffects } from './components/WaterEffects';

function App() {
  return (
    <>
      <BackgroundBubbles />
      <WaterEffects />
      <GameContainer />
    </>
  );
}

export default App;
