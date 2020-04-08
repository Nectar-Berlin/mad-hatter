import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { SendData, AccountBalanceData, PluginPageContext, ButtonProps, PageProps } from '@burner-wallet/types';
import { withBurner, DataProviders } from '@burner-wallet/ui-core';
import WhiteRabbitClient from '@whiterabbitjs/client';

import config from '../config.json';
import WhiteRabbitPlugin from '../WhiteRabbitPlugin';
const classes = require('./MoviePage.module.css');

type MovieData = {
  title: string;
  posterUrl: string;
  director: string;
  producer: string;
  actors: Array<string>;
  productionCompanies: Array<string>;
};

type PageType = React.FC<PageProps & { className?: string }>;

type MoviePageContext = PluginPageContext & RouteComponentProps & {
  plugin: WhiteRabbitPlugin;
};

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

const MessagePage = styled.div`
  padding: 0;
  background-color: black;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ImageBackdrop = styled.div<{ backgroundImage?: string }>`
  width: 100%;
  height: 100%;
  padding: var(--page-margin);
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  color: rgba(255, 255, 255, 0.9);
  background: linear-gradient(
    rgba(0, 0, 0, 0.4), 
    rgba(0, 0, 0, 0.9)
  ), no-repeat top/100% url(${({ backgroundImage }) => backgroundImage});
`;

const { AccountBalance } = DataProviders;

const getMovieMetadata = async (imdbId: string): Promise<MovieData> => {
  const { title, poster_path, production_companies } = await fetch(
    `https://api.themoviedb.org/3/movie/tt${imdbId}?api_key=${config.theMovieDbApiKey}`
  ).then(resp => resp.json());

  const { cast, crew } = await fetch(
    `https://api.themoviedb.org/3/movie/tt${imdbId}/credits?api_key=${config.theMovieDbApiKey}`
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

const MoviePage: React.FC<MoviePageContext> = ({ plugin, actions, assets, burnerComponents, location }) => {
  const [movieData, setMovieData] = useState<MovieData>();
  const [movieOwner, setMovieOwner] = useState<string>();
  const [noSuchToken, setNoSuchToken] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const Page = burnerComponents.Page as PageType;
  const Button = burnerComponents.Button as React.FC<ButtonProps>;

  const { pathname } = location;
  const [, tokenId] = pathname.match(/\/movie\/(\d+)\/?/i) || [];
  let imdbId: string = '';
  try {
    imdbId = WhiteRabbitClient.tokenToImdb(tokenId);
  } catch (e) {
    console.error('Cannot decode tokenId', e);
  }

  if (!imdbId) {
    return (
      <MessagePage>
        Invalid movie token Id
      </MessagePage>
    );
  }
  
  useEffect(() => {
    if (!movieData) { 
      if (!isLoading) {
        setIsLoading(true);
        getMovieMetadata(imdbId).then(data => {
          setMovieData(data);
          setIsLoading(false);
        });
        const movieContract = plugin.getMovieContract();
        movieContract.methods.ownerOf(tokenId).call().then((owner: string) => {
          setMovieOwner(owner)
        }).catch((e: any) => {
          console.error(e);
          setNoSuchToken(true);
        });
      }
    }  
  });

  if (noSuchToken) { 
    return (
      <MessagePage>
        Movie token is not registered on the network.
      </MessagePage>
    );
  }

  if (!movieData || !movieOwner) { 
    return (
      <MessagePage>
        Loading..
      </MessagePage>
    );
  }

  const ActionButton = styled(Button)`
    padding: 0 42px;
    background: #fafafa;
    color: rgba(0, 0, 0, 0.9);
    margin: 0 14px;
  `;

  const PrimaryButton = styled(ActionButton)`
    background: #fadaaa;
  `;

  const asset = assets[0];
  const value = plugin.getPaymentAmount();

  const send = () => {
    const sendProps: SendData = {
      to: movieOwner,
      asset: asset.id,
      message: null,
      ether: value,
    };

    actions.send(sendProps);
  };

  return (
    <Page className={classes.moviePage}>
      <ImageBackdrop backgroundImage={movieData.posterUrl}>
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
        <AccountBalance
          asset={asset}
          render={(data: AccountBalanceData | null) => {
            const exceedsBalance = !!data
              && parseFloat(value) > parseFloat(data.displayMaximumSendableBalance);
            return (
              <ActionButtons>
                <PrimaryButton
                  onClick={() => send()}
                  disabled={exceedsBalance}
                >
                  Pay €2
                </PrimaryButton>
                <ActionButton>Decline</ActionButton>
              </ActionButtons>
            );
          }}
        />
      </ImageBackdrop>
    </Page>
  );
};

export default withBurner(MoviePage);
