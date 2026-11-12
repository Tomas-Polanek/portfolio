/** Language-independent site data. Texts live in cs.ts / en.ts. */
export const site = {
  name: "Tomáš Polánek",
  url: "https://tomaspolanek.dev",
  email: "tomaspolanek1@icloud.com",
  /** Web3Forms access key for the contact form. Public by design; mail goes to the address tied to the key. */
  web3formsKey: "fdceeb9e-8cb5-43b9-9c92-5e703278d5dc",
  githubUser: "Tomas-Polanek",
  /** Shell prompt shown in the homelab terminal card. */
  homelabPrompt: "tpolanek@HomeLab:~",
  links: {
    github: "https://github.com/Tomas-Polanek",
    linkedin: "https://www.linkedin.com/in/tom%C3%A1%C5%A1-pol%C3%A1nek-48a587348/",
    instagram: "https://www.instagram.com/tomas_polanek/",
  },
} as const;
