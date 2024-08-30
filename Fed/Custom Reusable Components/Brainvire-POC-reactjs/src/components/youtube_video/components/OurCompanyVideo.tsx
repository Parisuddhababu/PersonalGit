import { useEffect, useRef } from "react";

const OurCompanyVideo = ({ VideoLink }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect((): (() => void) => {
    const videoElement: HTMLVideoElement = videoRef.current;

    if (!videoElement) return;
    const options: { threshold: number } = {
      threshold: 0.5,
    };

    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        entries.forEach((entry: IntersectionObserverEntry): void => {
          if (entry.isIntersecting) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
      },
      options
    );

    observer.observe(videoElement);

    return (): void => {
      observer.unobserve(videoElement);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      id="bv_video"
      loop
      muted
      width="640"
      height="360"
      playsInline
    >
      <source src={VideoLink} type="video/mp4" />
    </video>
  );
};

export default OurCompanyVideo;
