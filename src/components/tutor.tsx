import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, MessageCircle } from "lucide-react";
import { PageHeading } from "./common";
import { buttonVariants } from "./ui/button";

export function Tutor({ base }: { base: string }) {
  return (
    <>
      <PageHeading
        eyebrow="A LITTLE HELP, WHEN YOU NEED IT"
        title="Meet your future learning companion."
        description="Patient explanations. Real-life conversations. English at your pace."
      />
      <div className="tutor-intro card">
        <span className="tutor-orb">
          <MessageCircle size={39} strokeWidth={1.3} />
        </span>
        <span className="skill-pill">COMING IN A FUTURE ITERATION</span>
        <h2>A thoughtful tutor takes thoughtful preparation.</h2>
        <p className="muted">
          AI chat, writing feedback, and conversation practice are not connected
          yet. When available, responses will be generated securely on the
          server, with clear feedback and evidence limits.
        </p>
        <div className="tutor-capabilities">
          <span>
            <BookOpen size={20} /> Clear grammar help
          </span>
          <span>
            <MessageCircle size={20} /> Everyday conversations
          </span>
          <span>
            <Headphones size={20} /> Listening & speaking practice
          </span>
        </div>
        <Link className={buttonVariants()} href={`${base}/lessons`}>
          Explore today&apos;s lessons <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
