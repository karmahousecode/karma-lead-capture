import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Karma House Painting"

interface EstimateNotificationProps {
  requestId?: string
  fullName?: string
  phone?: string
  email?: string
  address?: string
  contactMethod?: string
  projectType?: string[]
  propertyType?: string
  sqft?: string
  stories?: string
  occupied?: string
  hoa?: string
  scope?: string[]
  conditions?: string[]
  timeline?: string
  dateFlexibility?: string
  budget?: string
  otherBids?: string
  notes?: string
  photoUrls?: string[]
}

const EstimateNotificationEmail = (props: EstimateNotificationProps) => {
  const {
    requestId, fullName, phone, email, address, contactMethod,
    projectType, propertyType, sqft, stories, occupied, hoa,
    scope, conditions, timeline, dateFlexibility, budget,
    otherBids, notes, photoUrls,
  } = props

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New estimate request from {fullName || 'a customer'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={h1}>New Estimate Request</Heading>
          </Section>

          <Section style={section}>
            <Heading as="h2" style={h2}>Customer Information</Heading>
            <Text style={label}>Name</Text>
            <Text style={value}>{fullName || '—'}</Text>
            <Text style={label}>Phone</Text>
            <Text style={value}><Link href={`tel:${phone}`} style={link}>{phone || '—'}</Link></Text>
            <Text style={label}>Email</Text>
            <Text style={value}>{email || '—'}</Text>
            <Text style={label}>Address</Text>
            <Text style={value}>{address || '—'}</Text>
            <Text style={label}>Preferred Contact</Text>
            <Text style={value}>{contactMethod || '—'}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={section}>
            <Heading as="h2" style={h2}>Project Details</Heading>
            <Text style={label}>Project Type</Text>
            <Text style={value}>{(projectType || []).join(', ') || '—'}</Text>
            <Text style={label}>Property Type</Text>
            <Text style={value}>{propertyType || '—'}</Text>
            <Text style={label}>Sq Ft</Text>
            <Text style={value}>{sqft || '—'}</Text>
            <Text style={label}>Stories</Text>
            <Text style={value}>{stories || '—'}</Text>
            <Text style={label}>Occupied</Text>
            <Text style={value}>{occupied || '—'}</Text>
            <Text style={label}>HOA</Text>
            <Text style={value}>{hoa || '—'}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={section}>
            <Heading as="h2" style={h2}>Scope & Conditions</Heading>
            <Text style={label}>Scope</Text>
            <Text style={value}>{(scope || []).join(', ') || '—'}</Text>
            <Text style={label}>Conditions</Text>
            <Text style={value}>{(conditions || []).join(', ') || '—'}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={section}>
            <Heading as="h2" style={h2}>Timing & Budget</Heading>
            <Text style={label}>Timeline</Text>
            <Text style={value}>{timeline || '—'}</Text>
            <Text style={label}>Flexibility</Text>
            <Text style={value}>{dateFlexibility || '—'}</Text>
            <Text style={label}>Budget</Text>
            <Text style={value}>{budget || '—'}</Text>
            <Text style={label}>Other Bids</Text>
            <Text style={value}>{otherBids || '—'}</Text>
          </Section>

          {notes ? (
            <>
              <Hr style={divider} />
              <Section style={section}>
                <Heading as="h2" style={h2}>Additional Notes</Heading>
                <Text style={notesBox}>{notes}</Text>
              </Section>
            </>
          ) : null}

          {photoUrls && photoUrls.length > 0 ? (
            <>
              <Hr style={divider} />
              <Section style={section}>
                <Heading as="h2" style={h2}>📷 Photos ({photoUrls.length})</Heading>
                {photoUrls.map((url: string, i: number) => (
                  <Text key={i} style={value}>
                    <Link href={url} style={link}>View Photo {i + 1}</Link>
                  </Text>
                ))}
              </Section>
            </>
          ) : null}

          <Section style={footerSection}>
            <Text style={footerId}>Request ID: {requestId || '—'}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: EstimateNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New Estimate Request – ${data.fullName || 'Karma House Painting'}`,
  to: 'mark@karmahouse.com',
  displayName: 'Estimate request notification',
  previewData: {
    requestId: 'abc-123',
    fullName: 'Jane Doe',
    phone: '(949) 555-1234',
    email: 'jane@example.com',
    address: '123 Main St, Irvine, CA',
    contactMethod: 'phone',
    projectType: ['Interior Painting', 'Exterior Painting'],
    propertyType: 'house',
    sqft: '2,000',
    stories: '2',
    occupied: 'occupied',
    hoa: 'yes',
    scope: ['Walls', 'Ceilings', 'Trim'],
    conditions: ['Peeling Paint', 'Cracks'],
    timeline: 'Next month',
    dateFlexibility: 'Flexible',
    budget: '$5,000 - $10,000',
    otherBids: 'No',
    notes: 'Please call before 5pm.',
    photoUrls: ['https://example.com/photo1.jpg'],
  },
} satisfies TemplateEntry

// Styles — matching Karma House brand (dark charcoal #1a1a2e, gold #c9a96e)
const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = {
  backgroundColor: '#1a1a2e',
  padding: '24px 25px',
  borderRadius: '8px 8px 0 0',
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#c9a96e',
  margin: '0',
  fontFamily: "'Playfair Display', Georgia, serif",
}
const h2 = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#1a1a2e',
  margin: '0 0 12px',
}
const section = { padding: '16px 25px' }
const label = {
  fontSize: '12px',
  fontWeight: '600' as const,
  color: '#888888',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}
const value = {
  fontSize: '14px',
  color: '#333333',
  margin: '2px 0 12px',
  lineHeight: '1.4',
}
const link = { color: '#c9a96e', textDecoration: 'underline' }
const divider = { borderColor: '#e5e5e5', margin: '0' }
const notesBox = {
  fontSize: '14px',
  color: '#333333',
  backgroundColor: '#f5f5f5',
  padding: '12px',
  borderRadius: '8px',
  margin: '0',
  lineHeight: '1.5',
}
const footerSection = {
  backgroundColor: '#1a1a2e',
  padding: '16px 25px',
  borderRadius: '0 0 8px 8px',
  textAlign: 'center' as const,
}
const footerId = {
  fontSize: '12px',
  color: '#c9a96e',
  margin: '0',
}
