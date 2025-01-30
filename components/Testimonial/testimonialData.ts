import image1 from "@/public/images/user/user-01.png";
import image2 from "@/public/images/user/user-02.png";
import { Testimonial } from "@/types/testimonial";

export const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Devid Smith",
    designation: "Operations Manager @LogiTrack",
    image: image1,
    content:
      "GoDeskless has revolutionized our field operations with its intelligent document retrieval system. Our team is now able to access critical documents in seconds, boosting productivity and reducing errors significantly.",
  },
  {
    id: 2,
    name: "John Abraham",
    designation: "Director @FieldForcePro",
    image: image2,
    content:
      "Using GoDeskless, we’ve streamlined data analysis and improved service delivery times. The RAG AI integration is a game-changer for industries with deskless workers like ours.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    designation: "HR Lead @CareConnect",
    image: image1,
    content:
      "With GoDeskless, managing our field staff has become effortless. Its smart tools have enhanced communication and helped us maintain better coordination, even in remote locations.",
  },
  {
    id: 4,
    name: "Michael Lee",
    designation: "CEO @SmartWater Solutions",
    image: image2,
    content:
      "The GoDeskless ISRA platform has significantly optimized our water management operations. Real-time access to data and seamless collaboration have been pivotal in our success.",
  },
];
