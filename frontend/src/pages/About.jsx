import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, Target, Eye, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import company, { phoneHref, whatsappHref, emailHref } from '../config/company';

const cardStyle = {
  background: 'var(--bg-card, #ffffff)',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
};

const gridStyle = (min) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))`,
  gap: '20px',
});

export default function About() {
  return (
    <div>
      {/* Story */}
      <section style={{ padding: '72px 0 48px' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">About {company.shortName}</span>
            <h2 className="section-title">Bringing Sri Lankan Natural Manufacturing to Modern Markets</h2>
            <p className="section-desc">{company.intro}</p>
          </div>

          <div style={{ ...gridStyle('320px'), alignItems: 'center' }}>
            <div>
              <h3 style={{ marginTop: 0 }}>Our Story</h3>
              {company.story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{paragraph}</p>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <img
                src="/images/factory.png"
                alt={`${company.name} manufacturing facility`}
                style={{ width: '100%', borderRadius: '16px', display: 'block' }}
              />
              <div style={{ ...cardStyle, position: 'absolute', left: '16px', bottom: '16px', padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MapPin size={18} /> <span style={{ fontSize: '14px' }}>{company.address}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '48px 0' }}>
        <div className="container" style={gridStyle('300px')}>
          <div style={cardStyle}>
            <h3 style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 0 }}>
              <Target size={24} color="var(--accent-gold)" /> Our Mission
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 0 }}>{company.mission}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 0 }}>
              <Eye size={24} color="var(--accent-gold)" /> Our Vision
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 0 }}>{company.vision}</p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why {company.shortName}</span>
            <h2 className="section-title">Why Choose {company.shortName}?</h2>
          </div>
          <div style={gridStyle('260px')}>
            {company.strengths.map((item) => (
              <div key={item.title} style={{ ...cardStyle, display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={22} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ margin: '0 0 6px' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product range */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What We Manufacture</span>
            <h2 className="section-title">Our Product Range</h2>
            <p className="section-desc">
              Natural food products, herbal ingredients, beverages, spices, and wellness-focused manufacturing solutions developed for both local and international markets.
            </p>
          </div>
          <div style={gridStyle('260px')}>
            {company.productRange.map((range) => (
              <div key={range.name} style={cardStyle}>
                <h4 style={{ margin: '0 0 6px' }}>{range.name}</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>{range.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business services */}
      <section style={{ padding: '48px 0' }}>
        <div className="container" style={gridStyle('260px')}>
          {company.services.map((service) => (
            <div key={service.title} style={cardStyle}>
              <h4 style={{ margin: '0 0 6px' }}>{service.title}</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Contact</span>
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-desc">
              Our team is available to assist with product orders, manufacturing-related inquiries and partnership opportunities.
            </p>
          </div>

          <div style={gridStyle('240px')}>
            <div style={cardStyle}>
              <MapPin size={26} color="var(--accent-gold)" />
              <h4 style={{ margin: '10px 0 6px' }}>Visit Us</h4>
              <p style={{ margin: '0 0 8px', color: 'var(--text-muted)' }}>{company.address}</p>
              <a href={company.mapUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </div>

            <div style={cardStyle}>
              <Mail size={26} color="var(--accent-gold)" />
              <h4 style={{ margin: '10px 0 6px' }}>Email</h4>
              <a href={emailHref} style={{ wordBreak: 'break-all' }}>{company.email}</a>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                Orders, export and bulk inquiries. We reply within 24 hours.
              </p>
            </div>

            {(phoneHref || whatsappHref) && (
              <div style={cardStyle}>
                {phoneHref ? <Phone size={26} color="var(--accent-gold)" /> : <MessageCircle size={26} color="var(--accent-gold)" />}
                <h4 style={{ margin: '10px 0 6px' }}>Call or WhatsApp</h4>
                {phoneHref && <p style={{ margin: '0 0 4px' }}><a href={phoneHref}>{company.phone}</a></p>}
                {whatsappHref && <p style={{ margin: 0 }}><a href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>}
              </div>
            )}

            <div style={cardStyle}>
              <Clock size={26} color="var(--accent-gold)" />
              <h4 style={{ margin: '10px 0 6px' }}>Business Hours</h4>
              {company.hours.map((h) => (
                <p key={h.days} style={{ margin: '0 0 4px' }}>
                  <strong>{h.days}:</strong> {h.time}
                </p>
              ))}
              <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>{company.hoursNote}</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
