import { NextResponse } from "next/server"

const categories = [
  { id: "1", name: "WordPress Development", slug: "wordpress", courseCount: 45, icon: "wordpress" },
  { id: "2", name: "Web Development", slug: "web-development", courseCount: 89, icon: "code" },
  { id: "3", name: "App Development", slug: "app-development", courseCount: 34, icon: "smartphone" },
  { id: "4", name: "JavaScript", slug: "javascript", courseCount: 67, icon: "javascript" },
  { id: "5", name: "IT & Software", slug: "it-software", courseCount: 52, icon: "server" },
  { id: "6", name: "Graphics Design", slug: "graphics-design", courseCount: 41, icon: "palette" },
  { id: "7", name: "UI/UX Design", slug: "ui-ux", courseCount: 38, icon: "layers" },
  { id: "8", name: "Business", slug: "business", courseCount: 29, icon: "briefcase" },
  { id: "9", name: "Marketing", slug: "marketing", courseCount: 23, icon: "megaphone" },
  { id: "10", name: "Data Science", slug: "data-science", courseCount: 31, icon: "database" },
]

export async function GET() {
  return NextResponse.json({
    categories,
    total: categories.length,
  })
}
