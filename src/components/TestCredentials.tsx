import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const testCredentials = [
  {
    type: 'Admin',
    email: 'admin@library.com',
    password: 'admin123',
    description: 'Admin account for testing admin features'
  },
  {
    type: 'User',
    email: 'user@library.com', 
    password: 'user123',
    description: 'Regular user account for testing user features'
  },
  {
    type: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    description: 'Test user for general testing'
  }
];

export const TestCredentials = () => {
  const [showPasswords, setShowPasswords] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Test Credentials</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Use these credentials to test the application
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Show Passwords</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        {testCredentials.map((cred, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{cred.type}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Email:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono">{cred.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => copyToClipboard(cred.email, 'Email')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Password:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono">
                    {showPasswords ? cred.password : '••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => copyToClipboard(cred.password, 'Password')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">{cred.description}</p>
          </div>
        ))}
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          💡 Click the copy button to copy credentials to clipboard
        </div>
      </CardContent>
    </Card>
  );
};