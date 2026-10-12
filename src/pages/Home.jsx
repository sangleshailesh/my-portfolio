import { Rail } from '../components/Rail/Rail';
import { About } from '../components/About/About';
import { Experience } from '../components/Experience/Experience';
import { Work } from '../components/Work/Work';
import { Skills } from '../components/Skills/Skills';
import { Recognition } from '../components/Recognition/Recognition';
import { Contact } from '../components/Contact/Contact';
import { Footer } from '../components/Footer/Footer';
import { Seo } from '../components/Seo/Seo';
import { buildPersonSchema } from '../lib/schema';
import { links } from '../lib/content';
import styles from './Home.module.css';

export default function Home() {
  return (
    <>
      <Seo jsonLd={buildPersonSchema({ linkedin: links.linkedin, github: links.github })} />

      <div className={styles.layout}>
        <Rail />

        <main id="content" className={styles.content} tabIndex={-1}>
          <About />
          <Experience />
          <Work />
          <Skills />
          <Recognition />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  );
}
