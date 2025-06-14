
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Star, Zap } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen vip-gradient text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Logo Section */}
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <img src="/lovable-uploads/60f33973-4d25-45cd-ab56-8d36ade1a7b1.png" alt="Sir Ole VVIP Protocol Logo" className="h-32 w-32 object-contain" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">
              Sir Ole <span className="text-vip-gold">VVIP</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light">
              Premium Protocol Administration
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 my-12 animate-fade-in-up" style={{
          animationDelay: '0.2s'
        }}>
            <div className="bg-black/80 border border-vip-gold/30 rounded-2xl p-6 vip-hover-lift backdrop-blur-sm">
              <Shield className="h-8 w-8 text-vip-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Secure Access</h3>
              <p className="text-sm text-white/80">Role-based authentication with enterprise-grade security</p>
            </div>
            <div className="bg-black/80 border border-vip-gold/30 rounded-2xl p-6 vip-hover-lift backdrop-blur-sm">
              <Star className="h-8 w-8 text-vip-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">VVIP Excellence</h3>
              <p className="text-sm text-white/80">Luxury service management with premium protocol standards</p>
            </div>
            <div className="bg-black/80 border border-vip-gold/30 rounded-2xl p-6 vip-hover-lift backdrop-blur-sm">
              <Zap className="h-8 w-8 text-vip-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Intelligent Analytics</h3>
              <p className="text-sm text-white/80">Real-time insights and comprehensive reporting suite</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6 animate-fade-in-up" style={{
          animationDelay: '0.4s'
        }}>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Access the premier administrative platform for VVIP protocol management, 
              client relations, and luxury service coordination.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="vip-gold-gradient hover:opacity-90 text-white px-8 py-3 text-lg font-medium vip-hover-lift" onClick={() => window.location.href = '/dashboard'}>
                <Crown className="h-5 w-5 mr-2" />
                Enter Dashboard
              </Button>
              
              <div className="text-sm opacity-75">
                <p>Demo Credentials:</p>
                <p><strong>Super Admin:</strong> super@sirole.com</p>
                <p><strong>Protocol Admin:</strong> protocol@sirole.com</p>
                <p><strong>Password:</strong> vip123</p>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            
          </div>
        </div>
      </div>
    </div>;
};
export default Index;
