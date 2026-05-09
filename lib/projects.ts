export interface Task {
  id: string;
  title: string;
  description: string;
  type: "bridge" | "swap" | "stake" | "testnet" | "social" | "build";
  points: number;
  link: string;
}

export interface Project {
  id: string;
  name: string;
  chain: string;
  description: string;
  probability: number;
  status: "testnet" | "mainnet" | "tge-soon";
  website: string;
  twitter: string;
  tasks: Task[];
}

export const PROJECTS: Project[] = [
  {
    id: "genlayer",
    name: "GenLayer",
    chain: "EVM",
    description: "AI-powered smart contracts with optimistic consensus. Builders program active — early contributors are prime airdrop targets.",
    probability: 88,
    status: "testnet",
    website: "https://genlayer.com",
    twitter: "https://twitter.com/genlayer",
    tasks: [
      {
        id: "gl-1",
        title: "Join Builders Program",
        description: "Apply and get accepted into the GenLayer builders program",
        type: "build",
        points: 30,
        link: "https://genlayer.com/builders",
      },
      {
        id: "gl-2",
        title: "Deploy a Smart Contract",
        description: "Deploy at least one intelligent contract on GenLayer testnet",
        type: "testnet",
        points: 25,
        link: "https://studio.genlayer.com",
      },
      {
        id: "gl-3",
        title: "Follow on Twitter",
        description: "Follow @genlayer and engage with their content",
        type: "social",
        points: 5,
        link: "https://twitter.com/genlayer",
      },
      {
        id: "gl-4",
        title: "Join Discord",
        description: "Join the GenLayer Discord and introduce yourself",
        type: "social",
        points: 5,
        link: "https://discord.gg/genlayer",
      },
      {
        id: "gl-5",
        title: "Submit Feedback",
        description: "Submit a bug report or product feedback via their portal",
        type: "build",
        points: 15,
        link: "https://genlayer.com/feedback",
      },
    ],
  },
  {
    id: "miden",
    name: "Miden",
    chain: "Polygon ZK",
    description: "Polygon's ZK rollup with client-side proving. Early testnet users historically get rewarded in ZK ecosystem airdrops.",
    probability: 75,
    status: "testnet",
    website: "https://polygon.technology/miden",
    twitter: "https://twitter.com/0xPolygonMiden",
    tasks: [
      {
        id: "mi-1",
        title: "Create Miden Account",
        description: "Create an account on the Miden testnet",
        type: "testnet",
        points: 20,
        link: "https://testnet.miden.io",
      },
      {
        id: "mi-2",
        title: "Send Test Transaction",
        description: "Send at least one transaction on Miden testnet",
        type: "testnet",
        points: 20,
        link: "https://testnet.miden.io",
      },
      {
        id: "mi-3",
        title: "Use Miden Faucet",
        description: "Request test tokens from the Miden faucet",
        type: "testnet",
        points: 10,
        link: "https://faucet.miden.io",
      },
      {
        id: "mi-4",
        title: "Follow on Twitter",
        description: "Follow @0xPolygonMiden on Twitter",
        type: "social",
        points: 5,
        link: "https://twitter.com/0xPolygonMiden",
      },
      {
        id: "mi-5",
        title: "Run a Node",
        description: "Run a Miden node locally or in the cloud",
        type: "build",
        points: 30,
        link: "https://docs.polygon.technology/miden/node",
      },
    ],
  },
  {
    id: "arc",
    name: "Arc",
    chain: "L1",
    description: "Circle-backed L1 blockchain on testnet. With Circle's backing and USDC integration, this is one of the highest conviction plays of 2025.",
    probability: 82,
    status: "testnet",
    website: "https://arc.net",
    twitter: "https://twitter.com/arcprotocol",
    tasks: [
      {
        id: "arc-1",
        title: "Join Arc Testnet",
        description: "Sign up and join the Arc L1 testnet",
        type: "testnet",
        points: 25,
        link: "https://arc.net/testnet",
      },
      {
        id: "arc-2",
        title: "Bridge to Arc",
        description: "Bridge funds to the Arc testnet",
        type: "bridge",
        points: 20,
        link: "https://bridge.arc.net",
      },
      {
        id: "arc-3",
        title: "Make a Swap",
        description: "Perform a token swap on Arc testnet",
        type: "swap",
        points: 15,
        link: "https://app.arc.net/swap",
      },
      {
        id: "arc-4",
        title: "Follow on Twitter",
        description: "Follow Arc on Twitter and retweet announcements",
        type: "social",
        points: 5,
        link: "https://twitter.com/arcprotocol",
      },
      {
        id: "arc-5",
        title: "Join Waitlist",
        description: "Join the Arc mainnet waitlist",
        type: "social",
        points: 10,
        link: "https://arc.net/waitlist",
      },
    ],
  },
];
