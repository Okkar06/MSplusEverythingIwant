"use client";

import type { Profile } from "@/lib/types";
import type { useCouple } from "@/lib/use-couple";
import { useLocationSharing } from "@/lib/use-location-sharing";
import { useNow } from "@/lib/time";
import { DistanceHero } from "./distance-hero";
import { MoodCard } from "./mood-card";
import { MoodPicker } from "./mood-picker";
import { LocationCard } from "./location-card";
import { MiniMap } from "./mini-map";
import { NameCard } from "./name-card";
import { UnlinkCard } from "./unlink-card";

type Props = {
  couple: ReturnType<typeof useCouple>;
  me: Profile;
  partner: Profile;
  onSignOut: () => void;
};

export function HomeScreen({ couple, me, partner, onSignOut }: Props) {
  const now = useNow();
  const location = useLocationSharing(me.id);
  const mine = couple.locations[me.id];
  const theirs = couple.locations[partner.id];

  return (
    <>
      <header>
        <h1 className="font-display text-heading">
          <span className="text-you">You</span> &amp;{" "}
          <span className="text-partner">{partner.display_name}</span>
        </h1>
      </header>

      <DistanceHero
        mine={mine}
        theirs={theirs}
        partnerName={partner.display_name}
        sharing={location.sharing}
        now={now}
      />

      {mine && theirs && (
        <MiniMap mine={mine} theirs={theirs} partnerName={partner.display_name} now={now} delayMs={30} />
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <MoodCard name="You" tone="you" mood={couple.moods[me.id]} now={now} delayMs={60} />
        <MoodCard
          name={partner.display_name}
          tone="partner"
          mood={couple.moods[partner.id]}
          now={now}
          delayMs={120}
        />
      </div>

      <MoodPicker current={couple.moods[me.id]} onPick={couple.setMood} delayMs={180} />

      <LocationCard
        partnerName={partner.display_name}
        sharing={location.sharing}
        error={location.error}
        onStart={location.start}
        onStop={location.stop}
        delayMs={240}
      />

      <NameCard name={me.display_name} onSave={couple.setName} onSignOut={onSignOut} delayMs={300} />

      <UnlinkCard
        partnerName={partner.display_name}
        onUnlink={async () => {
          // Turn sharing off first, so it doesn't quietly resume with a future partner.
          await location.stop();
          return couple.unlink();
        }}
        delayMs={360}
      />

      {couple.error && (
        <p role="alert" className="text-center text-small text-ink">
          Something went wrong: {couple.error}
        </p>
      )}
    </>
  );
}
