"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Phone, Mail, Trash2, User, Plus } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { count } from "console";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export default function ContactsPage() {
  const [isClient, setIsClient] = useState(false);
  const [contacts, setContacts] = useLocalStorage<Contact[]>("contacts", []);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
    };
    setContacts([...contacts, contact]);
    setNewContact({ name: "", phone: "", email: "" });
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  if (!isClient) {
    return <div className="container max-w-2xl mx-auto p-4"></div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-2xl mx-auto p-4"
      >
        <Card className="mb-4">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[200px] relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="İsim"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  className="pl-8"
                  required
                />
              </div>

                <div className="flex-1 min-w-[200px] relative">
                <PhoneInput
                  placeholder="Telefon"
                  value={newContact.phone}
                  onChange={(value) => {
                    setNewContact({ ...newContact, phone: value });
                  }}
                  defaultCountry="TR"
                  countries={["TR", "US", "GB"]}
                  required
                />
                </div>

              <div className="flex-1 min-w-[200px] relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="E-posta"
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  className="pl-8"
                  required
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto gap-2">
                <Plus className="h-4 w-4" />
                Ekle
              </Button>
            </form>
          </CardContent>
        </Card>

        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {contacts.map((contact) => (
              <m.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <Card className="hover:bg-slate-50 transition-colors">
                  <CardContent className="flex justify-between items-center p-3">
                    <div className="flex gap-4 items-center">
                      <m.div
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                      >
                        {contact.name[0].toUpperCase()}
                      </m.div>
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <div className="flex gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>
                              {contact.phone.replace(
                              /(\d{2})(\d{3})(\d{3})(\d{4})/,
                              "$1 $2 $3 $4"
                              )}
                            </span>
                            </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </div>
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  );
}
