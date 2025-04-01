import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, Users, Hammer, Package, Shield, MapPin, MessageSquare } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getCtaButton = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex gap-4">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Créer un compte
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Découvrir les projets
          </Link>
        </div>
      );
    }

    const role = user?.roles[0].name;
    if (role === 'PORTEURDEPROJET') {
      return (
        <Link
          to="/projet/create"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Créer un projet
        </Link>
      );
    }

    if (role === 'TRAVAILLEUR') {
      return (
        <Link
          to="/travailleur/projects"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Rejoindre un projet
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Community work"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Construisons ensemble, localement.
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            La plateforme qui connecte projets, travailleurs bénévoles, et fournisseurs pour transformer nos quartiers.
          </p>
          <div className="mt-10">
            {getCtaButton()}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              CoBuild facilite la collaboration locale en mettant en relation les porteurs de projets, les volontaires, et les fournisseurs de matériaux.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Créez ou découvrez un projet</h3>
                <p className="mt-2 text-base text-gray-500">
                  Proposez votre initiative ou trouvez des projets qui vous inspirent près de chez vous.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Rejoignez l'équipe</h3>
                <p className="mt-2 text-base text-gray-500">
                  Proposez vos compétences ou vos matériaux pour faire avancer le projet.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Hammer className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Collaborez</h3>
                <p className="mt-2 text-base text-gray-500">
                  Travaillez ensemble et suivez l'avancement du projet jusqu'à sa réalisation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Fonctionnalités clés
            </h2>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Hammer,
                  title: 'Gestion de projets',
                  description: 'Créez, suivez et archivez vos projets communautaires.'
                },
                {
                  icon: Users,
                  title: 'Recrutement de bénévoles',
                  description: 'Publiez des offres de poste et recevez des candidatures.'
                },
                {
                  icon: Package,
                  title: 'Partage de matériaux',
                  description: 'Les fournisseurs peuvent proposer des matériaux gratuitement ou à coût réduit.'
                },
                {
                  icon: MessageSquare,
                  title: 'Messagerie intégrée',
                  description: 'Discutez avec les membres du projet en temps réel.'
                },
                {
                  icon: MapPin,
                  title: 'Projets autour de vous',
                  description: 'Trouvez des initiatives proches de chez vous grâce à la géolocalisation.'
                },
                {
                  icon: Shield,
                  title: 'Modération & sécurité',
                  description: "L'équipe admin veille à la qualité et à la sécurité des échanges."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Ils témoignent
            </h2>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "Grâce à CoBuild, on a pu rénover le square du quartier avec 12 bénévoles !",
                  author: "Jeanne",
                  role: "porteuse de projet"
                },
                {
                  quote: "J'ai trouvé un projet qui avait besoin de mes compétences en peinture. C'est gratifiant.",
                  author: "Samir",
                  role: "travailleur"
                },
                {
                  quote: "Une super initiative qui permet de donner une seconde vie à nos matériaux.",
                  author: "Marie",
                  role: "fournisseur"
                }
              ].map((testimonial, index) => (
                <blockquote key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  <p className="text-lg text-gray-900 italic">"{testimonial.quote}"</p>
                  <footer className="mt-4">
                    <p className="text-base font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Prêt à faire la différence ?</span>
            <span className="block text-blue-200">Rejoignez la communauté CoBuild.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Créer un compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;