import Hero from '@/components/Hero';
import Amenities from '@/components/Amenities';
import Gallery from '@/components/Gallery';
import ContactForm from '@/components/ContactForm';

const HomePage = (): React.JSX.Element => {
  return (
    <>
      <Hero />
      <Amenities />
      <Gallery />
           <ContactForm />
    </>
  );
};

export default HomePage;
