import { Box } from '@canva/easel';
import { Routes, Route, useLocation } from 'react-router-dom';
import '@canva/easel/styles.css';
import styles from './App.module.css';
import Home from '@/pages/home/Home';
import Projects from '@/pages/home/Projects';
import Templates from '@/pages/home/Templates';
import More from '@/pages/home/More';
import Brand from '@/pages/home/Brand';
import CanvaAI from '@/pages/home/CanvaAI';
import CanvaAIChat from '@/pages/home/CanvaAI/CanvaAIChat';
import Apps from '@/pages/home/Apps';
import Creator from '@/pages/home/Creator';
import CreatorsHub from '@/pages/home/Creator/CreatorsHub';
import Inspiration from '@/pages/home/Creator/Inspiration';
import ElementsCreator from '@/pages/home/Creator/ElementsCreator';
import MyItems from '@/pages/home/Creator/MyItems';
import Resources from '@/pages/home/Creator/Resources';
import Grow from '@/pages/home/Grow';
import DesignSchool from '@/pages/home/DesignSchool';
import Photos from '@/pages/home/Photos';
import Editor from '@/pages/Editor';
import Settings from '@/pages/home/Settings';
import SignedOutExperience from '@/pages/SignedOut';
import BackgroundRemover from '@/pages/SignedOut/BackgroundRemover';
import VideoGeneration from '@/pages/SignedOut/VideoGeneration';
import ResumeBuilder from '@/pages/SignedOut/ResumeBuilder';
import PrimaryNav from '@/shared_components/PrimaryNav';
import ContextualNav from '@/shared_components/ContextualNav';
import NavTabs from '@/shared_components/NavTabs';
import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';

function App() {
  const { state } = useAppContext();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const isEditor = pathname.startsWith('/editor');
  const isAiChat = pathname.startsWith('/ai/chat') || pathname.startsWith('/ai/thread');

  return (
    <>
      {!isMobile && <PrimaryNav />}
      {!isMobile && state.sidebarVisible && state.secondaryNavVisible && <ContextualNav />}
      {isMobile && !isEditor && !isAiChat && <NavTabs />}

      <Box
        className={`${styles.content} ${!state.sidebarVisible ? styles.contentFullWidth : ''} ${isMobile && isAiChat ? styles.contentNoNavTabs : ''}`}
        paddingY="1u"
        paddingEnd="1u"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/more" element={<More />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/ai" element={<CanvaAI />} />
          <Route path="/ai/chat" element={<CanvaAIChat />} />
          <Route path="/ai/thread/:chatId" element={<CanvaAIChat />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:category" element={<Apps />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/creator/creators-hub" element={<CreatorsHub />} />
          <Route path="/creator/inspiration" element={<Inspiration />} />
          <Route path="/creator/elements-creator" element={<ElementsCreator />} />
          <Route path="/creator/my-items" element={<MyItems />} />
          <Route path="/creator/resources" element={<Resources />} />
          <Route path="/grow" element={<Grow />} />
          <Route path="/design-school" element={<DesignSchool />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:doctype" element={<Editor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signed-out-experience" element={<SignedOutExperience />} />
          <Route path="/signed-out-experience/background-remover" element={<BackgroundRemover />} />
          <Route path="/signed-out-experience/video-generation" element={<VideoGeneration />} />
          <Route path="/signed-out-experience/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
