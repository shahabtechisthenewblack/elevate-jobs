import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground/5 py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ElevateJobs
              </span>
            </div>
            <p className="text-muted-foreground">
              Empowering careers with AI-powered tools and insights.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tools</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/resume-builder" className="block hover:text-primary transition-colors">Resume Builder</Link>
              <Link to="/cover-letter" className="block hover:text-primary transition-colors">Cover Letter Generator</Link>
              <Link to="/interview-prep" className="block hover:text-primary transition-colors">Interview Prep</Link>
              <Link to="/linkedin-optimizer" className="block hover:text-primary transition-colors">LinkedIn Optimizer</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="/about" className="block hover:text-primary transition-colors">About</a>
              <a href="/pricing" className="block hover:text-primary transition-colors">Pricing</a>
              <a href="/contact" className="block hover:text-primary transition-colors">Contact</a>
              <a href="/careers" className="block hover:text-primary transition-colors">Careers</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="/help" className="block hover:text-primary transition-colors">Help Center</a>
              <a href="/privacy" className="block hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/terms" className="block hover:text-primary transition-colors">Terms of Service</a>
              <a href="/contact" className="block hover:text-primary transition-colors">Contact Support</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ElevateJobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;