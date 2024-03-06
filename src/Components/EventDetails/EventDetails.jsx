import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCubesStacked,
  faAddressCard,
  faCube,
} from "@fortawesome/free-solid-svg-icons";

function parseLinks(strings) {
  const linkRegex = /(https?:\/\/[^\s]+)/g; // regular expression to match URLs
  return strings.map((str) => {
    const matches = str.match(linkRegex);
    if (matches) {
      const parts = str.split(linkRegex);
      return parts.map((part, index) => {
        if (matches.includes(part)) {
          return (
            <a
              className="text-blue-500"
              key={index}
              href={part}
              target="_blank"
              rel="noreferrer"
            >
              {part}
            </a>
          );
        } else {
          return part;
        }
      });
    } else {
      return str;
    }
  });
}

function getRegistrationFeesForEvent(event) {
  const teamSize = event.team_size;

  const canParticipateSolo = teamSize === 1;
  const canParticipateWithTeamOf2 = teamSize === 2;
  const canParticipateWithTeamOf2To4 = teamSize > 2 && teamSize <= 4;
  const canParticipateWithTeamOfMoreThan4 = teamSize > 4;

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-5">
        Registration Fees
      </h2>
      {
        canParticipateSolo &&
        <>
          <h2 className="text-xl text-center">
            Team of One
          </h2>
          <p className="w-fit text-primary text-2xl text-center my-5 rounded-full py-2 px-5 border-2 border-primary bg-transparent mx-auto">
            &#8377; 99
          </p>
        </>
      }
      {
        canParticipateWithTeamOf2 &&
        <>
          <h2 className="text-xl text-center">
            Team of 2
          </h2>
          <p className="w-fit text-primary text-2xl text-center my-5 rounded-full py-2 px-5 border-2 border-primary bg-transparent mx-auto">
            &#8377; 199
          </p>
        </>
      }
      {
        canParticipateWithTeamOf2To4 &&
        <>
          <h2 className="text-xl text-center">
            Team of 2-4
          </h2>
          <p className="w-fit text-primary text-2xl text-center my-5 rounded-full py-2 px-5 border-2 border-primary bg-transparent mx-auto">
            &#8377; 299
          </p>
        </>
      }
      {
        canParticipateWithTeamOfMoreThan4 &&
        <>
          <h2 className="text-xl text-center">
            Team of 4+
          </h2>
          <p className="w-fit text-primary text-2xl text-center my-5 rounded-full py-2 px-5 border-2 border-primary bg-transparent mx-auto">
            &#8377; 399
          </p>
        </>
      }
    </>
  );
}

const EventDetails = ({ event }) => {
  const rules = parseLinks(event.rules);
  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-center">Event Details</h2>
      <div className="grid md:grid-cols-3 grid-cols-1 my-5">
        <div className="flex flex-col items-center py-3">
          <FontAwesomeIcon
            icon={faUsers}
            className="text-3xl my-2 text-quaternary"
          />
          <h3 className="text-xl font-bold my-2">Team Size</h3>
          <p className="text-xl font-semibold">{event.team_size}</p>
          <p className="text-sm mt-1">(Min Team Size {event.min_team_size})</p>
        </div>
        <div className="flex flex-col items-center py-3">
          <FontAwesomeIcon
            icon={faCubesStacked}
            className="text-3xl my-2 text-quaternary"
          />
          <h3 className="text-xl font-bold my-2">Rounds</h3>
          <p className="text-xl font-semibold">{event.rounds}</p>
        </div>
        <div className="flex flex-col items-center py-3">
          <FontAwesomeIcon
            icon={faAddressCard}
            className="text-3xl my-2 text-quaternary"
          />
          <h3 className="text-xl font-bold my-2">Registration Limit</h3>
          <p className="text-xl font-semibold">
            {parseInt(event.registration_limit)
              ? event.registration_limit
              : "NA"}
          </p>
          <p className="text-sm mt-1">
            {parseInt(event.registration_limit)
              ? (event.registration_limit - event.registered_teams.length < 20 ? `(Available Slots ${event.registration_limit - event.registered_teams.length
                })` : null)
              : null}
          </p>
        </div>
      </div>
      <div className="py-5 md:w-4/5 w-11/12 mx-auto">
        <h2 className="text-2xl font-bold text-center mb-5">Rules</h2>
        <ul className="flex flex-col items-start mb-5">
          {rules.map((rule, index) => (
            <li key={index} className="my-2 text-justify">
              <FontAwesomeIcon icon={faCube} className="mx-3" />
              {rule}
            </li>
          ))}
        </ul>
      </div>
      {getRegistrationFeesForEvent(event)}
    </div>
  );
};

export default EventDetails;
