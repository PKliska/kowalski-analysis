import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  "The Future of Electronics: A Look Ahead",
  "Top 10 Must-Have Electronics for Your Home",
  "The Evolution of Electronics: From Vacuum Tubes to Modern Transistors",
  "5 Exciting Emerging Trends in Electronics",
  "The Pros and Cons of Using Rechargeable Batteries",
  "How to Choose the Right Electronics for Your Needs",
  "The Importance of Electronics Recycling and E-Waste Management",
  "The Advantages and Disadvantages of Wireless Charging",
  "DIY Electronics Projects for Beginners",
  "The Role of Artificial Intelligence in Electronics",
  "5 Essential Tools for Electronics Repair and Maintenance",
  "The Benefits of Smart Home Technology for Everyday Life",
  "The Impact of Wearable Electronics on Health and Fitness",
  "The Future of Robotics: A Revolution in Electronics",
  "How to Safely Dispose of Old Electronics",
  "The Basics of Circuit Design for Electronics Enthusiasts",
  "The Benefits of OLED Technology in Electronics",
  "The Importance of Cybersecurity in the Age of Smart Electronics",
  "How to Troubleshoot Common Electronics Problems",
  "The Benefits and Risks of Using Electronic Cigarettes",
  "The Evolution of Audio Electronics: From Vinyl to Digital",
  "How to Build Your Own Custom Gaming PC",
  "The Environmental Impact of Electronics Manufacturing",
  "The Advantages of 5G Technology for Electronics and Communication"
];

const posts = [...Array(23)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/assets/images/covers/cover_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.datatype.number(),
  comment: faker.datatype.number(),
  share: faker.datatype.number(),
  favorite: faker.datatype.number(),
  author: {
    name: faker.name.fullName(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
}));

export default posts;
