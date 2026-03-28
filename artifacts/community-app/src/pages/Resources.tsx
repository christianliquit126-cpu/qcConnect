import { ExternalLink, Phone, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const hotlines = [
  { name: "Philippine Red Cross", number: "143", desc: "24/7 emergency response and blood services" },
  { name: "DSWD Hotline", number: "931", desc: "Social welfare assistance and programs" },
  { name: "DOH HealthLine", number: "1555", desc: "Health inquiries and referrals" },
  { name: "NDRRMC", number: "(02) 8911-5061", desc: "National disaster risk reduction" },
  { name: "PNP Hotline", number: "117", desc: "Police emergency and assistance" },
  { name: "Bureau of Fire", number: "117", desc: "Fire emergency services" },
  { name: "QC Hotline", number: "122", desc: "Quezon City emergency services" },
  { name: "PAGASA", number: "(02) 8284-0800", desc: "Weather information and warnings" },
];

const resources = [
  {
    title: "Food Assistance Programs",
    items: ["Pantawid Pamilyang Pilipino Program (4Ps)", "DSWD Food Voucher Program", "Local Barangay Food Banks", "Community Kitchens near you"],
    color: "border-orange-200 dark:border-orange-800",
    headerBg: "bg-orange-50 dark:bg-orange-900/20",
    headerText: "text-orange-700 dark:text-orange-400",
  },
  {
    title: "Medical & Health",
    items: ["Malasakit Centers (public hospitals)", "PhilHealth Claims and Benefits", "Free Medical Missions", "Vaccination Sites Near You"],
    color: "border-red-200 dark:border-red-800",
    headerBg: "bg-red-50 dark:bg-red-900/20",
    headerText: "text-red-700 dark:text-red-400",
  },
  {
    title: "Education Support",
    items: ["DepEd School Supplies Program", "CHED Scholarships", "Public Library Access", "Free Online Learning Platforms"],
    color: "border-blue-200 dark:border-blue-800",
    headerBg: "bg-blue-50 dark:bg-blue-900/20",
    headerText: "text-blue-700 dark:text-blue-400",
  },
  {
    title: "Housing & Shelter",
    items: ["NHSA Resettlement Programs", "Pag-IBIG Housing Loans", "DSWD Emergency Shelter", "Community Shelter Assistance"],
    color: "border-green-200 dark:border-green-800",
    headerBg: "bg-green-50 dark:bg-green-900/20",
    headerText: "text-green-700 dark:text-green-400",
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources & Hotlines</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Find verified resources and emergency contact information</p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-orange-800 dark:text-orange-200">In case of emergency</p>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-0.5">
              Call <strong>911</strong> for immediate life-threatening emergencies. For other concerns, use the hotlines below.
            </p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" /> Emergency Hotlines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {hotlines.map((h) => (
              <Card key={h.name} className="border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{h.name}</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">{h.number}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{h.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Government Programs & Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res) => (
              <Card key={res.title} className={`border ${res.color}`}>
                <CardHeader className={`pb-2 pt-4 px-4 ${res.headerBg} rounded-t-xl`}>
                  <CardTitle className={`text-sm font-bold ${res.headerText}`}>{res.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <ul className="space-y-2">
                    {res.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
