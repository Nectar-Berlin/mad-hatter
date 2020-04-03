import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { withBurner, BurnerContext } from '@burner-wallet/ui-core';
import Button from '../../components/Button';
import Page from '../../components/Page';
import WhiteRabbitClient from '@whiterabbitjs/client';

const { tokenToImdb } = WhiteRabbitClient;

type MoviePagePageProps = BurnerContext & RouteComponentProps;

const TMD_API_KEY = 'b1854cc7cd8f2e29da75a04a3c946e44';

const MovieDetailsPanel = styled.div`
  margin-top: auto;
`;

const MovieAttr = styled.div`
  margin-top: 7px;
  font-size: 14px;
`;

const AttrLabel = styled.span`
  font-weight: bold;
  margin-right: 7px;
`;

const AttrValue = styled.span`
  
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 -14px;
  margin-top: 42px;
`;

const ActionButton = styled(Button)`
  padding: 0 42px;
  background: #fafafa;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 14px;
`;

const PrimaryButton = styled(ActionButton)`
  background: #fadaaa;
`;

type MovieData = {
  title: string;
  posterUrl: string;
  director: string;
  producer: string;
  actors: Array<string>;
  productionCompanies: Array<string>;
};

const getMovieMetadata = async (imdbId: string): Promise<MovieData> => {
  const { title, poster_path, production_companies } = await fetch(
    `https://api.themoviedb.org/3/movie/tt${imdbId}?api_key=${TMD_API_KEY}`
  ).then(resp => resp.json());

  const { cast, crew } = await fetch(
    `https://api.themoviedb.org/3/movie/tt${imdbId}/credits?api_key=${TMD_API_KEY}`
  ).then(resp => resp.json());

  const productionCompanies = production_companies.slice(0, 2).map((c: any) => c.name);
  const actors = cast.slice(0, 3).map((a: any) => a.name);
  const producer = crew.find((c: any) => c.job === 'Producer').name;
  const director = crew.find((c: any) => c.job === 'Director').name;

  return {
    title,
    posterUrl: `https://image.tmdb.org/t/p/w500${poster_path}`,
    director,
    producer,
    actors,
    productionCompanies
  };
}


const MoviePage: React.FC<MoviePagePageProps> = ({ actions, location }) => {
  const [movieData, setMovieData] = useState<MovieData>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const { pathname } = location;
  const [, tokenId] = pathname.match(/\/movie\/(\d+)\/?/i) || [];
  if (!tokenId) {
    return (
      <Page>
        Invalid movie token Id
      </Page>
    );
  }

  const imdbId = tokenToImdb(tokenId);  

  if (!movieData) {
    if (!isLoading) {
      setIsLoading(true);
      getMovieMetadata(imdbId).then(data => {
        setMovieData(data);
      });
    }
    return (
      <Page>
        Loading..
      </Page>
    );
  }  

  return (
    <Page backgroundImage={movieData.posterUrl}>
      <MovieDetailsPanel>
        <h1>{movieData.title}</h1>
        <MovieAttr>
          <AttrLabel>Director:</AttrLabel>
          <AttrValue>{movieData.director}</AttrValue>
        </MovieAttr>
        <MovieAttr>
          <AttrLabel>Producer:</AttrLabel>
          <AttrValue>{movieData.producer}</AttrValue>
        </MovieAttr>
        <MovieAttr>
          <AttrLabel>Actors:</AttrLabel>
          <AttrValue>{movieData.actors.join(',  ')}</AttrValue>
        </MovieAttr>
        <MovieAttr>
          <AttrLabel>Production company:</AttrLabel>
          <AttrValue>{movieData.productionCompanies.join(', ')}</AttrValue>
        </MovieAttr>
      </MovieDetailsPanel>
      <ActionButtons>
        <PrimaryButton>Pay €2</PrimaryButton>
        <ActionButton>Decline</ActionButton>
      </ActionButtons>
    
    </Page>
  );
};

export default withBurner(MoviePage);
