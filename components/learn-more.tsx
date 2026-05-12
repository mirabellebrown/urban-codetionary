import type { ResourceLink, VideoResource } from "@/lib/content/terms";

type LearnMoreProps = {
  links: ResourceLink[];
  videos: VideoResource[];
  defaultOpen?: boolean;
};

export function LearnMore({
  links,
  videos,
  defaultOpen = false,
}: LearnMoreProps) {
  return (
    <details className="learn-more" open={defaultOpen}>
      <summary className="learn-more__summary">+ learn more</summary>
      <div className="learn-more__body">
        <div className="learn-more__section">
          <p className="learn-more__label">curated links</p>
          {links.length > 0 ? (
            <ul className="learn-more__list">
              {links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} rel="noreferrer" target="_blank">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="learn-more__empty">No external docs attached yet.</p>
          )}
        </div>
        <div className="learn-more__section">
          <p className="learn-more__label">video references</p>
          {videos.length > 0 ? (
            <ul className="learn-more__video-list">
              {videos.map((video) => (
                <li className="learn-more__video-row" key={video.url}>
                  <div>
                    <a href={video.url} rel="noreferrer" target="_blank">
                      {video.title}
                    </a>
                    <p>
                      {video.channel} · {video.duration}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="learn-more__empty">No video walkthroughs attached yet.</p>
          )}
        </div>
      </div>
    </details>
  );
}
