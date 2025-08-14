# ClickMaliClub 🎯

*A comprehensive affiliate marketing platform built with the MERN stack*

## 🌟 Overview

ClickMaliClub is a production-ready affiliate marketing platform that connects users with the best deals and opportunities across various categories. Built with modern web technologies, it features a responsive design, real-time functionality, and comprehensive social media integration.

**Live Platform:** *Ready for deployment*

## ✨ Features

### 🏠 Core Platform
- **Modern UI/UX**: Responsive design with Tailwind CSS
- **Real Affiliate Deals**: Integration with major platforms (Amazon, ClickBank, ShareASale, etc.)
- **Category System**: Organized deals by technology, fashion, health, finance, and more
- **Search & Filter**: Advanced filtering and search capabilities
- **Newsletter System**: Email subscription with marketing automation

### 🔐 Security & Privacy
- **Data Protection**: No sensitive commission data exposed to users
- **Secure Authentication**: JWT-based user authentication
- **Privacy Compliant**: GDPR-ready privacy policies and terms of service
- **Environment Security**: Comprehensive .env configuration

### 📱 Social Media Integration
- **Instagram**: [@clickmaliclub](https://www.instagram.com/clickmaliclub)
- **TikTok**: [@clickmaliclub](https://www.tiktok.com/@clickmaliclub) 
- **X (Twitter)**: [@clickmaliclub](https://x.com/clickmaliclub)
- **Telegram**: [@clickmaliclub](https://t.me/clickmaliclub)
- **Pinterest**: [ClickMaliClub](https://pin.it/FRL5cIHPg)

### 📄 Content Pages
- **FAQ System**: Category-based filtering and search
- **Blog Platform**: Content management for affiliate marketing guides
- **Review System**: User reviews and ratings for deals
- **Contact Forms**: Multiple contact options with EmailJS integration

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Font Awesome 6**: Icon library for social media and UI elements
- **React Router**: Client-side routing and navigation
- **Error Boundaries**: Comprehensive error handling

### Backend
- **Node.js & Express**: RESTful API with middleware
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure user authentication
- **Express Middleware**: CORS, helmet, rate limiting
- **Real-time Features**: Socket.io integration ready

### Development Tools
- **pnpm**: Fast, disk space efficient package manager
- **ESLint & Prettier**: Code formatting and linting
- **Git**: Version control with comprehensive .gitignore
- **Environment Management**: Extensive .env configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeWithCal-W/ClickMaliClub.git
   cd ClickMaliClub
   ```

2. **Setup Server**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   pnpm install
   pnpm run seed  # Seed database with sample data
   pnpm start
   ```

3. **Setup Client**
   ```bash
   cd ../client
   cp .env.example .env
   # Edit .env with your configuration
   pnpm install
   pnpm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Core Endpoints
- `GET /api/deals` - Fetch all deals with filtering
- `GET /api/categories` - Get all deal categories
- `POST /api/newsletter` - Newsletter subscription
- `GET /api/guides` - Affiliate marketing guides
- `GET /api/reviews` - User reviews and ratings

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - User profile

*Full API documentation available in `/docs` (coming soon)*

## 🎯 Project Structure

```
ClickMaliClub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── styles/        # CSS and styling
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   └── package.json
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clickmaliclub
JWT_SECRET=your_super_secure_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_NAME=ClickMaliClub
REACT_APP_INSTAGRAM_URL=https://www.instagram.com/clickmaliclub
```

*See .env.example files for complete configuration options*

## 🌐 Deployment

### Production Setup
1. **Environment Configuration**
   - Update all environment variables for production
   - Configure MongoDB Atlas or production database
   - Set up email service (SendGrid, Mailgun, etc.)

2. **Build and Deploy**
   ```bash
   # Build client
   cd client && pnpm build
   
   # Deploy to your preferred platform
   # (Vercel, Netlify, Heroku, AWS, etc.)
   ```

### Recommended Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: MongoDB Atlas
- **Email**: SendGrid, Mailgun

## 📈 Features Roadmap

### Phase 1 ✅ (Completed)
- [x] Core affiliate platform
- [x] Social media integration
- [x] FAQ with filtering
- [x] Newsletter system
- [x] Responsive design
- [x] Security implementation

### Phase 2 🔄 (In Progress)
- [ ] User authentication system
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Payment processing
- [ ] Mobile app (React Native)

### Phase 3 📅 (Planned)
- [ ] AI-powered deal recommendations
- [ ] Multi-language support
- [ ] Advanced affiliate tracking
- [ ] Partnership integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CodeWithCal-W**
- GitHub: [@CodeWithCal-W](https://github.com/CodeWithCal-W)
- Project: [ClickMaliClub](https://github.com/CodeWithCal-W/ClickMaliClub)

## 🙏 Acknowledgments

- MERN Stack Community
- Tailwind CSS Team
- Font Awesome Icons
- MongoDB Documentation
- React Community

---

**Made with ❤️ for the affiliate marketing community**
Source code in a GitHub repository with proper documentation
Comprehensive test suite with good coverage
Live demonstration of the application
Project presentation highlighting key features and technical decisions

🛠️ Project Ideas (Optional)
Here are some project ideas you can consider:

E-commerce platform with product catalog, cart, and checkout
Task/project management system with team collaboration
Social media platform with posts, comments, and real-time notifications
Learning management system with courses, lessons, and progress tracking
Health and fitness tracker with data visualization
Recipe sharing platform with search and filtering
Job board with application tracking
Event management system with registration and ticketing
Feel free to come up with your own idea that demonstrates your skills and interests!
