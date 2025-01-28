import { FeatureTab } from "@/types/featureTab";


const featuresTabData: FeatureTab[] = [
  {
    id: "tabOne",
    title: "Cutting-Edge AI Models",
    desc1: `Powered by Llama 3.2`,
    desc2: `Experience the power of advanced AI with Llama 3.2, designed to process and understand your documents with unparalleled precision.`,
    image: "/images/features/llama.png",
    imageDark: "/images/features/llama.png",
  },
  {
    id: "tabTwo",
    title: "Advanced Retrieval Mechanism",
    desc1: `Smart Search, Accurate Results`,
    desc2: ` Our RAG application leverages vector search and semantic analysis to smartly deliver answers directly from the knowledge base.`,
    image: "/images/features/advancedret.png",
    imageDark: "/images/features/advancedret.png",
  },
  {
    id: "tabThree",
    title: "Fully Customizable & Scalable",
    desc1: `Built for Your Needs`,
    desc2: `Tailor the platform to suit your workflows with customizable APIs, branding options, and seamless scalability.`,
    image: "/images/features/featuressection.png",
    imageDark: "/images/features/featuressection.png",
  },
];

export default featuresTabData;
