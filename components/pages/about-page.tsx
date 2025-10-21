import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Heart, Crown, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation will be handled by the layout */}
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {/* Vision & Mission */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8">About TPH Global</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  TPH Global aims at raising &quot;Kingdom generals&quot; through principles of
                  loyalty, holiness, and Anakazo empowerment.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To provide a digital sanctuary that combines cutting-edge technology with uncompromised spiritual
                  values, empowering members to lead globally while staying rooted in Christ.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Loyalty</h3>
                <p className="text-sm text-muted-foreground">
                  Encouraging faithful commitment to spiritual principles and unwavering dedication to God&apos;s kingdom.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Holiness</h3>
                <p className="text-sm text-muted-foreground">
                  Promoting spiritual discipline and Christ-like character in all aspects of life and ministry.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Crown className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Anakazo Empowerment</h3>
                <p className="text-sm text-muted-foreground">
                  Equipping leaders through specialized training and resources for spiritual breakthrough.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Globe className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Global Leadership</h3>
                <p className="text-sm text-muted-foreground">
                  Developing influential Christian leaders who make a worldwide impact for the Kingdom.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Leadership Philosophy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Leadership Philosophy</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-lg mb-4">At TPH Global, we believe in raising leaders who are:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Grounded in biblical principles and sound doctrine</li>
                <li>Committed to personal growth and spiritual maturity</li>
                <li>Equipped with practical leadership skills and wisdom</li>
                <li>Focused on mentoring and developing others</li>
                <li>Dedicated to excellence in ministry and service</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Doctrinal Statement */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Doctrinal Statement</h2>
          <Card>
            <ScrollArea className="h-[300px]">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">The Bible</h3>
                    <p className="text-muted-foreground">
                      We believe the Bible is the inspired, infallible Word of God and our final authority for faith and
                      practice.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">The Trinity</h3>
                    <p className="text-muted-foreground">
                      We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Salvation</h3>
                    <p className="text-muted-foreground">
                      We believe salvation is by grace through faith in Jesus Christ alone, who died for our sins and
                      rose again.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">The Church</h3>
                    <p className="text-muted-foreground">
                      We believe the Church is the body of Christ, called to worship, fellowship, discipleship, and
                      mission.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">The Great Commission</h3>
                    <p className="text-muted-foreground">
                      We believe in the Great Commission to make disciples of all nations, teaching them to observe all
                      Christ commanded.
                    </p>
                  </div>
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </section>
      </main>
    </div>
  )
}

