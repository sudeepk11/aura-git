import π from "../../Assets/Team/π.jpg";
import Vinayak from "../../Assets/Team/Vinayak.jpg";
import SumitNaik from "../../Assets/Team/Sumit_Naik.jpg";
import Raj from "../../Assets/Team/Raj.jpg";
import Vaishnavi from "../../Assets/Team/VK.jpg";
import Sanjitha from "../../Assets/Team/S3.jpg";
import Tejaswith from "../../Assets/Team/Tejas.jpg";
import Jeetendra from "../../Assets/Team/Jeetendra.jpg";
import Philbert from "../../Assets/Team/philbert.jpg";
import Adarsh from "../../Assets/Team/adarsh.jpg";
import Shambavi from "../../Assets/Team/shambhavi.jpg";
import Soumya from "../../Assets/Team/soumya.jpg";
import Rohan from "../../Assets/Team/rohan.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const council = [
  {
    name: "Sumit Naik",
    role: "General Secretary",
    image: SumitNaik,
    phone: 8971061720,
  },
  {
    name: "Adarsh Belaskar",
    role: "General Secretary",
    image: Adarsh,
    // instagram: "https://www.instagram.com/vaishnavi_k2310/",
    phone: 8884294309,
    // handle: "vaishnavi_k2310",
  },
  {
    name: "Shambhavi Shirgurkar",
    role: "General Secretary",
    image: Soumya,
    // instagram: "https://www.instagram.com/Sanjitha_bhat/",
    phone: 7022095209,
    // handle: "Sanjitha_bhat",
  },
  {
    name: "Soumya Hurakadli",
    role: "General Secretary",
    image: Shambavi,
    // instagram: "https://www.instagram.com/rawwwj/",
    phone: 9148506325,
    // handle: "rawwwj",
  },
  {
    name: "Rohan Mangalore",
    role: "Cultural Co-Ordinator",
    image: Rohan,
    // instagram: "https://www.instagram.com/jeetendrakumargarag/",
    phone: 9902799657,
    // handle: "jeetendrakumargarag",
  },
  {
    name: "Philbert Dsouza",
    role: "Technical Co-Ordinator",
    image: Philbert,
    // instagram: "https://www.instagram.com/_tejas_x_5/",
    phone: 9380017175,
    // handle: "_tejas_x_5",
  },
];

const Contact = () => {
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 h-[100vh] bg-signinc w-screen user-none bg-contact md:bg-contain bg-no-repeat bg-cover md:bg-left bg-right bg-scroll overflow-scroll [&::-webkit-scrollbar]:hidden">
      <div className="md:col-start-2 col-span-2">
        <h2 className="text-2xl font-bold text-center mt-12">Contact Us</h2>
        <div className="grid md:grid-cols-2 grid-cols-1 my-5">
          {council.map((member) => (
            <div
              className="flex flex-col items-center py-3 glass m-5"
              key={member.name}
            >
              <img
                src={member.image}
                alt="avatar"
                className="rounded-full h-52 w-52 object-cover"
              />
              <h3 className="text-xl font-bold my-2">{member.name}</h3>
              <p className="text-lg font-semibold">{member.role}</p>
              <div className="grid mt-4">
                <p className="justify-self-center">+91 {member.phone}</p>
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="justify-self-center"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="text-2xl text-red-600 justify-self-center"
                    />

                    <> {member.handle}</>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
